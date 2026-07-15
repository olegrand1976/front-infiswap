import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../replacements/presentation/replacement_detail_screen.dart';
import '../data/applications_list_notifier.dart';
import '../models/application_item.dart';
import 'widgets/application_card.dart';

class ApplicationsScreen extends ConsumerStatefulWidget {
  const ApplicationsScreen({super.key});

  @override
  ConsumerState<ApplicationsScreen> createState() => _ApplicationsScreenState();
}

class _ApplicationsScreenState extends ConsumerState<ApplicationsScreen> {
  ApplicationStatusBucket? _filter;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final asyncList = ref.watch(applicationsListProvider);
    final notifier = ref.read(applicationsListProvider.notifier);
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
                          'Mes candidatures',
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
                      : 'Impossible de charger les candidatures.',
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

                  final counts = _countByBucket(items);
                  final filtered = _filter == null
                      ? items
                      : items
                          .where((item) =>
                              applicationStatusBucket(item.status) == _filter)
                          .toList();

                  return RefreshIndicator(
                    color: colors.primary,
                    onRefresh: notifier.refresh,
                    child: ListView(
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                      children: [
                        _StatsStrip(total: items.length, counts: counts),
                        const SizedBox(height: 14),
                        _FilterTabs(
                          total: items.length,
                          counts: counts,
                          selected: _filter,
                          onSelect: (bucket) =>
                              setState(() => _filter = bucket),
                        ),
                        const SizedBox(height: 12),
                        if (filtered.isEmpty)
                          Padding(
                            padding: const EdgeInsets.symmetric(vertical: 24),
                            child: Center(
                              child: Text(
                                'Aucune candidature dans ce filtre',
                                style: TextStyle(
                                    color: colors.textSecondary, fontSize: 13),
                              ),
                            ),
                          )
                        else
                          for (final item in filtered) ...[
                            ApplicationCard(
                              item: item,
                              onTap: () {
                                Navigator.of(context).push(
                                  MaterialPageRoute<void>(
                                    builder: (_) => ReplacementDetailScreen(
                                      item: item.replacement,
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

  static Map<ApplicationStatusBucket, int> _countByBucket(
      List<ApplicationItem> items) {
    final counts = {
      ApplicationStatusBucket.pending: 0,
      ApplicationStatusBucket.success: 0,
      ApplicationStatusBucket.danger: 0,
    };
    for (final item in items) {
      final bucket = applicationStatusBucket(item.status);
      counts[bucket] = (counts[bucket] ?? 0) + 1;
    }
    return counts;
  }
}

class _StatsStrip extends StatelessWidget {
  const _StatsStrip({required this.total, required this.counts});

  final int total;
  final Map<ApplicationStatusBucket, int> counts;

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
          BoxShadow(
              color: colors.shadow, blurRadius: 10, offset: const Offset(0, 3)),
        ],
      ),
      child: Row(
        children: [
          Expanded(
            child: _StatCell(
                value: total.toString(),
                label: 'TOTAL',
                color: colors.textPrimary),
          ),
          _StatDivider(color: colors.divider),
          Expanded(
            child: _StatCell(
              value: (counts[ApplicationStatusBucket.pending] ?? 0).toString(),
              label: 'EN ATTENTE',
              color: colors.pendingFg,
            ),
          ),
          _StatDivider(color: colors.divider),
          Expanded(
            child: _StatCell(
              value: (counts[ApplicationStatusBucket.success] ?? 0).toString(),
              label: 'CONFIRMÉES',
              color: colors.successFg,
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCell extends StatelessWidget {
  const _StatCell(
      {required this.value, required this.label, required this.color});

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
          style: TextStyle(
              color: color,
              fontSize: 19,
              fontWeight: FontWeight.w800,
              height: 1),
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
    return Container(
        width: 1,
        margin: const EdgeInsets.symmetric(vertical: 2),
        color: color);
  }
}

class _FilterTabs extends StatelessWidget {
  const _FilterTabs({
    required this.total,
    required this.counts,
    required this.selected,
    required this.onSelect,
  });

  final int total;
  final Map<ApplicationStatusBucket, int> counts;
  final ApplicationStatusBucket? selected;
  final ValueChanged<ApplicationStatusBucket?> onSelect;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 30,
      child: ListView(
        scrollDirection: Axis.horizontal,
        clipBehavior: Clip.none,
        children: [
          _FilterTab(
            label: 'Toutes',
            count: total,
            selected: selected == null,
            onTap: () => onSelect(null),
          ),
          const SizedBox(width: 6),
          _FilterTab(
            label: 'En attente',
            count: counts[ApplicationStatusBucket.pending] ?? 0,
            selected: selected == ApplicationStatusBucket.pending,
            onTap: () => onSelect(ApplicationStatusBucket.pending),
          ),
          const SizedBox(width: 6),
          _FilterTab(
            label: 'Confirmées',
            count: counts[ApplicationStatusBucket.success] ?? 0,
            selected: selected == ApplicationStatusBucket.success,
            onTap: () => onSelect(ApplicationStatusBucket.success),
          ),
          const SizedBox(width: 6),
          _FilterTab(
            label: 'Refusées',
            count: counts[ApplicationStatusBucket.danger] ?? 0,
            selected: selected == ApplicationStatusBucket.danger,
            onTap: () => onSelect(ApplicationStatusBucket.danger),
          ),
        ],
      ),
    );
  }
}

class _FilterTab extends StatelessWidget {
  const _FilterTab({
    required this.label,
    required this.count,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final int count;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: selected ? colors.textPrimary : Colors.transparent,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
                color: selected ? colors.textPrimary : colors.divider,
                width: 1.3),
          ),
          child: Text(
            '$label $count',
            style: TextStyle(
              color: selected ? colors.background : colors.textSecondary,
              fontSize: 10.5,
              fontWeight: FontWeight.w700,
            ),
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
          Icon(Icons.assignment_outlined, size: 38, color: colors.border),
          const SizedBox(height: 12),
          Text(
            'Aucune candidature',
            style: TextStyle(
                color: colors.textPrimary,
                fontSize: 13,
                fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 4),
          Text(
            'Postulez à un remplacement ou une mission — elles apparaîtront ici avec leur statut.',
            textAlign: TextAlign.center,
            style: TextStyle(
                color: colors.textSecondary, fontSize: 11.5, height: 1.5),
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
