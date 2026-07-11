import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../data/replacements_list_notifier.dart';
import '../models/replacement_item.dart';
import 'replacement_detail_screen.dart';
import 'widgets/active_search_chips.dart';
import 'widgets/mission_avatar.dart';
import 'widgets/replacement_filters_modal.dart';
import 'widgets/replacement_search_modal.dart';

class ReplacementsScreen extends ConsumerWidget {
  const ReplacementsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;
    final asyncList = ref.watch(replacementsListProvider);
    final notifier = ref.read(replacementsListProvider.notifier);
    final params = notifier.params;

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 12, 8),
              child: _ScreenTitle(
                title: 'Remplacements',
                hasActiveSearch: params.hasActiveSearch,
                hasActiveFilters: params.hasActiveFilters,
                onSearchTap: () => ReplacementSearchModal.show(
                  context,
                  initialZipCodes: params.zipCodes,
                  initialCities: params.cities,
                  onApply: ({required zipCodes, required cities}) {
                    notifier.applySearch(
                      zipCodes: zipCodes,
                      cities: cities,
                    );
                  },
                ),
                onFilterTap: () => ReplacementFiltersModal.show(
                  context,
                  initialCountry: params.country,
                  initialFilterType: params.filterType,
                  initialFilterRole: params.filterRole,
                  initialDays: params.days,
                  onApply: ({
                    required country,
                    required filterType,
                    required filterRole,
                    required days,
                  }) {
                    notifier.applyFilters(
                      country: country,
                      filterType: filterType,
                      filterRole: filterRole,
                      days: days,
                    );
                  },
                ),
              ),
            ),
            const ActiveSearchChips(),
            if (params.hasAnyActive) const SizedBox(height: 8),
            Expanded(
              child: asyncList.when(
                loading: () => Center(
                  child: CircularProgressIndicator(color: colors.primary),
                ),
                error: (error, _) => _ErrorState(
                  message: error is ApiException
                      ? error.message
                      : 'Impossible de charger les remplacements.',
                  onRetry: notifier.refresh,
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return _EmptyState(
                      hasActiveCriteria: params.hasAnyActive,
                      onClearFilters: notifier.clearAll,
                    );
                  }

                  return RefreshIndicator(
                    color: colors.primary,
                    onRefresh: notifier.refresh,
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

class _EmptyState extends StatelessWidget {
  const _EmptyState({
    required this.hasActiveCriteria,
    required this.onClearFilters,
  });

  final bool hasActiveCriteria;
  final VoidCallback onClearFilters;

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
              hasActiveCriteria
                  ? 'Aucun résultat pour ces critères'
                  : 'Aucun remplacement pour le moment',
              textAlign: TextAlign.center,
              style: TextStyle(color: colors.textSecondary),
            ),
            if (hasActiveCriteria) ...[
              const SizedBox(height: 16),
              TextButton(
                onPressed: onClearFilters,
                child: Text(
                  'Effacer les filtres',
                  style: TextStyle(color: colors.primary),
                ),
              ),
            ],
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
  const _ScreenTitle({
    required this.title,
    required this.hasActiveSearch,
    required this.hasActiveFilters,
    required this.onSearchTap,
    required this.onFilterTap,
  });

  final String title;
  final bool hasActiveSearch;
  final bool hasActiveFilters;
  final VoidCallback onSearchTap;
  final VoidCallback onFilterTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  color: colors.textPrimary,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            _ActionIconButton(
              icon: Icons.search_outlined,
              showBadge: hasActiveSearch,
              onTap: onSearchTap,
            ),
            _ActionIconButton(
              icon: Icons.tune_outlined,
              showBadge: hasActiveFilters,
              onTap: onFilterTap,
            ),
          ],
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

class _ActionIconButton extends StatelessWidget {
  const _ActionIconButton({
    required this.icon,
    required this.showBadge,
    required this.onTap,
  });

  final IconData icon;
  final bool showBadge;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Stack(
      clipBehavior: Clip.none,
      children: [
        IconButton(
          onPressed: onTap,
          icon: Icon(icon, color: colors.textPrimary),
        ),
        if (showBadge)
          Positioned(
            top: 10,
            right: 10,
            child: Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: colors.primary,
                shape: BoxShape.circle,
                border: Border.all(color: colors.card, width: 1.5),
              ),
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
            border: Border.all(color: colors.border),
            boxShadow: [
              BoxShadow(
                color: colors.shadow,
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
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
