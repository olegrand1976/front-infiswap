import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../data/my_replacements_list_notifier.dart';
import '../models/replacement_item.dart';
import 'replacement_detail_screen.dart';
import 'widgets/replacement_list_card.dart';

class MyReplacementsScreen extends ConsumerWidget {
  const MyReplacementsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;
    final asyncList = ref.watch(myReplacementsListProvider);
    final notifier = ref.read(myReplacementsListProvider.notifier);
    final canPop = Navigator.of(context).canPop();

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 20, 8),
              child: Row(
                children: [
                  if (canPop)
                    IconButton(
                      onPressed: () => context.pop(),
                      icon: Icon(Icons.arrow_back, color: colors.primary),
                    )
                  else
                    const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Mes remplacements',
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
                    ),
                  ),
                ],
              ),
            ),
            Expanded(
              child: asyncList.when(
                loading: () => Center(
                  child: CircularProgressIndicator(color: colors.primary),
                ),
                error: (error, _) => _ErrorState(
                  message: error is ApiException
                      ? error.message
                      : 'Impossible de charger vos remplacements.',
                  onRetry: notifier.refresh,
                ),
                data: (items) {
                  if (items.isEmpty) {
                    return RefreshIndicator(
                      color: colors.primary,
                      onRefresh: notifier.refresh,
                      child: ListView(
                        padding: const EdgeInsets.symmetric(vertical: 40),
                        children: const [_EmptyState()],
                      ),
                    );
                  }

                  final counts = _countByStatus(items);

                  return RefreshIndicator(
                    color: colors.primary,
                    onRefresh: notifier.refresh,
                    child: ListView(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                      children: [
                        _StatsStrip(total: items.length, counts: counts),
                        const SizedBox(height: 14),
                        for (final item in items) ...[
                          _MyReplacementCard(
                            item: item,
                            onTap: () {
                              Navigator.of(context).push(
                                MaterialPageRoute<void>(
                                  builder: (_) => ReplacementDetailScreen(
                                    item: item,
                                    isOwner: true,
                                  ),
                                ),
                              );
                            },
                          ),
                          const SizedBox(height: 10),
                        ],
                      ],
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

  static Map<MyReplacementStatus, int> _countByStatus(List<ReplacementItem> items) {
    final counts = {
      MyReplacementStatus.open: 0,
      MyReplacementStatus.filled: 0,
      MyReplacementStatus.closed: 0,
    };
    for (final item in items) {
      final status = myReplacementStatus(item);
      counts[status] = (counts[status] ?? 0) + 1;
    }
    return counts;
  }
}

class _StatsStrip extends StatelessWidget {
  const _StatsStrip({required this.total, required this.counts});

  final int total;
  final Map<MyReplacementStatus, int> counts;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 13),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.border),
        boxShadow: [
          BoxShadow(color: colors.shadow, blurRadius: 10, offset: const Offset(0, 3)),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: _StatCell(value: total.toString(), label: 'TOTAL', color: colors.textPrimary),
          ),
          _StatDivider(color: colors.divider),
          Expanded(
            child: _StatCell(
              value: (counts[MyReplacementStatus.open] ?? 0).toString(),
              label: 'OUVERTS',
              color: colors.pendingFg,
            ),
          ),
          _StatDivider(color: colors.divider),
          Expanded(
            child: _StatCell(
              value: (counts[MyReplacementStatus.filled] ?? 0).toString(),
              label: 'POURVUS',
              color: colors.successFg,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCell extends StatelessWidget {
  const _StatCell({required this.value, required this.label, required this.color});

  final String value;
  final String label;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          value,
          style: TextStyle(color: color, fontSize: 19, fontWeight: FontWeight.w800, height: 1),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: colors.textSecondary,
            fontSize: 9,
            fontWeight: FontWeight.w600,
            letterSpacing: .2,
          ),
        ),
      ],
    );
  }
}

class _StatDivider extends StatelessWidget {
  const _StatDivider({required this.color});

  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(width: 1, margin: const EdgeInsets.symmetric(vertical: 2), color: color);
  }
}

class _MyReplacementCard extends StatelessWidget {
  const _MyReplacementCard({required this.item, required this.onTap});

  final ReplacementItem item;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final status = myReplacementStatus(item);
    final (statusBg, statusFg) = switch (status) {
      MyReplacementStatus.filled => (colors.successBg, colors.successFg),
      MyReplacementStatus.closed => (colors.dangerBg, colors.dangerFg),
      MyReplacementStatus.open => (colors.pendingBg, colors.pendingFg),
    };

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(13),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: colors.divider),
            boxShadow: [
              BoxShadow(color: colors.shadow, blurRadius: 14, offset: const Offset(0, 6)),
            ],
          ),
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
                        Row(
                          children: [
                            if (item.isUrgent) ...[
                              const ReplacementUrgentBadge(),
                              const SizedBox(width: 6),
                            ],
                            if (item.isBoosted) const ReplacementBoostStars(size: 12),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          item.role,
                          style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 13.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 2),
                        ReplacementCardMetaRow(icon: Icons.location_on_outlined, text: item.zipCodesLabel),
                        const SizedBox(height: 2),
                        ReplacementCardMetaRow(icon: Icons.calendar_today_outlined, text: item.dateLabel),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusBg,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      myReplacementStatusLabel(status),
                      style: TextStyle(color: statusFg, fontSize: 9.5, fontWeight: FontWeight.w800),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 9),
              Container(
                padding: const EdgeInsets.only(top: 8),
                decoration: BoxDecoration(border: Border(top: BorderSide(color: colors.divider))),
                child: Row(
                  children: [
                    Icon(Icons.groups_outlined, size: 12, color: colors.primary),
                    const SizedBox(width: 5),
                    Text(
                      '${item.responseCount} candidature${item.responseCount > 1 ? 's' : ''}',
                      style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 10.5,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState();

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Column(
        children: [
          Icon(Icons.campaign_outlined, size: 38, color: colors.border),
          const SizedBox(height: 12),
          Text(
            'Aucun remplacement publié',
            style: TextStyle(color: colors.textPrimary, fontSize: 13, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 4),
          Text(
            'Vos annonces publiées apparaîtront ici avec leur statut et le nombre de candidatures reçues.',
            textAlign: TextAlign.center,
            style: TextStyle(color: colors.textSecondary, fontSize: 11.5, height: 1.5),
          ),
        ],
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
