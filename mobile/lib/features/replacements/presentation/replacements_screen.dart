import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../data/replacements_repository.dart';
import '../models/replacement_item.dart';
import 'replacement_detail_screen.dart';
import 'widgets/mission_avatar.dart';

class ReplacementsScreen extends ConsumerWidget {
  const ReplacementsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;
    final asyncList = ref.watch(replacementsListProvider);

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: _ScreenTitle(title: 'Remplacements'),
            ),
            Expanded(
              child: asyncList.when(
                loading: () => Center(
                  child: CircularProgressIndicator(color: colors.primary),
                ),
                error: (error, _) => _ErrorState(
                  message: error is ApiException
                      ? error.message
                      : 'Impossible de charger les remplacements.',
                  onRetry: () => ref.invalidate(replacementsListProvider),
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return Center(
                      child: Text(
                        'Aucun remplacement pour le moment',
                        style: TextStyle(color: colors.textSecondary),
                      ),
                    );
                  }

                  return RefreshIndicator(
                    color: colors.primary,
                    onRefresh: () async {
                      ref.invalidate(replacementsListProvider);
                      await ref.read(replacementsListProvider.future);
                    },
                    child: ListView.separated(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                      itemCount: items.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        final item = items[index];
                        return _ReplacementCard(
                          item: item,
                          onTap: () {
                            Navigator.of(context).push(
                              MaterialPageRoute<void>(
                                builder: (_) =>
                                    ReplacementDetailScreen(item: item),
                              ),
                            );
                          },
                        );
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({
    required this.message,
    required this.onRetry,
  });

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.coral),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: onRetry,
              style: ElevatedButton.styleFrom(
                backgroundColor: colors.primary,
                foregroundColor: colors.onPrimary,
              ),
              child: const Text('Réessayer'),
            ),
          ],
        ),
      ),
    );
  }
}

class _ScreenTitle extends StatelessWidget {
  const _ScreenTitle({required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: TextStyle(
            color: colors.textPrimary,
            fontSize: 28,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 8),
        Container(
          width: 48,
          height: 3,
          decoration: BoxDecoration(
            color: colors.primary,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
      ],
    );
  }
}

class _ReplacementCard extends StatelessWidget {
  const _ReplacementCard({
    required this.item,
    required this.onTap,
  });

  final ReplacementItem item;
  final VoidCallback onTap;

  static String? _previewDescription(String raw) {
    final cleaned = raw.trim().replaceAll(RegExp(r'\s+'), ' ');
    if (cleaned.isEmpty) {
      return null;
    }
    const maxChars = 72;
    if (cleaned.length <= maxChars) {
      return cleaned;
    }
    return '${cleaned.substring(0, maxChars).trimRight()}…';
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final descriptionPreview = _previewDescription(item.description);

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(12),
          ),
          clipBehavior: Clip.antiAlias,
          child: IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(width: 3, color: colors.primary),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _MetaRow(
                                    icon: Icons.location_on_outlined,
                                    text: item.zipCodesLabel,
                                  ),
                                  const SizedBox(height: 3),
                                  _MetaRow(
                                    icon: Icons.calendar_today_outlined,
                                    text: item.dateLabel,
                                  ),
                                ],
                              ),
                            ),
                            if (item.isUrgent) ...[
                              const SizedBox(width: 6),
                              const _UrgentBadge(),
                            ],
                          ],
                        ),
                        if (item.isBoosted) ...[
                          const SizedBox(height: 4),
                          const _BoostStars(size: 12),
                        ],
                        const SizedBox(height: 6),
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _MetaRow(
                                    icon: item.isMission
                                        ? Icons.school_outlined
                                        : Icons.medical_services_outlined,
                                    text: item.role,
                                    emphasize: true,
                                  ),
                                  if (descriptionPreview != null) ...[
                                    const SizedBox(height: 2),
                                    Text(
                                      descriptionPreview,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: TextStyle(
                                        color: colors.textSecondary,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w400,
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            ),
                            if (item.isMission) ...[
                              const SizedBox(width: 8),
                              MissionAvatar(
                                logoUrl: item.institutionLogoUrl,
                                size: 24,
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MetaRow extends StatelessWidget {
  const _MetaRow({
    required this.icon,
    required this.text,
    this.emphasize = false,
  });

  final IconData icon;
  final String text;
  final bool emphasize;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final color =
        emphasize ? colors.textPrimary : colors.textSecondary;

    return Row(
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            text,
            style: TextStyle(
              color: color,
              fontSize: emphasize ? 13 : 12,
              fontWeight: emphasize ? FontWeight.w500 : FontWeight.w400,
            ),
          ),
        ),
      ],
    );
  }
}

class _BoostStars extends StatelessWidget {
  const _BoostStars({this.size = 18});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: List.generate(
        5,
        (_) => Icon(Icons.star, size: size, color: const Color(0xFFFBBF24)),
      ),
    );
  }
}

class _UrgentBadge extends StatelessWidget {
  const _UrgentBadge();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: AppColors.coral,
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.campaign_outlined, size: 12, color: Colors.white),
          SizedBox(width: 3),
          Text(
            'Urgent',
            style: TextStyle(
              color: Colors.white,
              fontSize: 10,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
