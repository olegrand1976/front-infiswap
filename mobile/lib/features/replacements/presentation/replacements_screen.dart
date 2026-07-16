import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../data/replacements_list_notifier.dart';
import '../models/replacement_item.dart';
import '../models/replacement_search_params.dart';
import 'replacement_detail_screen.dart';
import 'widgets/active_search_chips.dart';
import 'widgets/mission_avatar.dart';
import 'widgets/replacement_filters_modal.dart';
import 'widgets/replacement_search_modal.dart';

class ReplacementsScreen extends ConsumerStatefulWidget {
  const ReplacementsScreen({super.key});

  @override
  ConsumerState<ReplacementsScreen> createState() =>
      _ReplacementsScreenState();
}

class _ReplacementsScreenState extends ConsumerState<ReplacementsScreen> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.removeListener(_onScroll);
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (!_scrollController.hasClients) return;
    final threshold = _scrollController.position.maxScrollExtent - 300;
    if (_scrollController.position.pixels >= threshold) {
      ref.read(replacementsListProvider.notifier).loadMore();
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final asyncList = ref.watch(replacementsListProvider);
    final isLoadingMore = ref.watch(replacementsLoadingMoreProvider);
    final notifier = ref.read(replacementsListProvider.notifier);
    final params = notifier.params;
    final resultCount = asyncList.maybeWhen(
      data: (items) => items.length,
      orElse: () => null,
    );
    final searchSummary = [...params.zipCodes, ...params.cities];

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: _ListHeader(
                resultCount: resultCount,
                country: params.country,
                hasActiveFilters: params.hasActiveFilters,
                searchSummary:
                    searchSummary.isEmpty ? null : searchSummary.join(', '),
                filterType: params.filterType,
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
                onClearSearch: () => notifier.applySearch(
                  zipCodes: const [],
                  cities: const [],
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
                onSelectType: (type) => notifier.applyFilters(
                  country: params.country,
                  filterType: type,
                  filterRole: params.filterRole,
                  days: params.days,
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
                      controller: _scrollController,
                      padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
                      itemCount: items.length + (isLoadingMore ? 1 : 0),
                      separatorBuilder: (_, __) => const SizedBox(height: 10),
                      itemBuilder: (context, index) {
                        if (index >= items.length) {
                          return Padding(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            child: Center(
                              child: CircularProgressIndicator(
                                color: colors.primary,
                              ),
                            ),
                          );
                        }
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

class _ListHeader extends StatelessWidget {
  const _ListHeader({
    required this.resultCount,
    required this.country,
    required this.hasActiveFilters,
    required this.searchSummary,
    required this.filterType,
    required this.onSearchTap,
    required this.onClearSearch,
    required this.onFilterTap,
    required this.onSelectType,
  });

  final int? resultCount;
  final String country;
  final bool hasActiveFilters;
  final String? searchSummary;
  final String filterType;
  final VoidCallback onSearchTap;
  final VoidCallback onClearSearch;
  final VoidCallback onFilterTap;
  final ValueChanged<String> onSelectType;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final countLabel = resultCount == null
        ? ' '
        : '$resultCount résultat${resultCount == 1 ? '' : 's'} · '
            '${replacementCountryLabels[country] ?? country}';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Remplacements',
                    style: TextStyle(
                      color: colors.textPrimary,
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    countLabel,
                    style: TextStyle(
                      color: colors.textSecondary,
                      fontSize: 12.5,
                      fontFeatures: const [FontFeature.tabularFigures()],
                    ),
                  ),
                ],
              ),
            ),
            _FilterButton(
                hasActiveFilters: hasActiveFilters, onTap: onFilterTap),
          ],
        ),
        const SizedBox(height: 12),
        _SearchPill(
          summary: searchSummary,
          onTap: onSearchTap,
          onClear: onClearSearch,
        ),
        const SizedBox(height: 10),
        _TypeTabs(selected: filterType, onSelect: onSelectType),
      ],
    );
  }
}

class _FilterButton extends StatelessWidget {
  const _FilterButton({required this.hasActiveFilters, required this.onTap});

  final bool hasActiveFilters;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: colors.card,
          border: Border.all(color: colors.divider),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.center,
          children: [
            Icon(Icons.tune_outlined, color: colors.textPrimary, size: 19),
            if (hasActiveFilters)
              Positioned(
                top: -3,
                right: -3,
                child: Container(
                  width: 9,
                  height: 9,
                  decoration: BoxDecoration(
                    color: colors.primary,
                    shape: BoxShape.circle,
                    border: Border.all(color: colors.background, width: 2),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _SearchPill extends StatelessWidget {
  const _SearchPill({
    required this.summary,
    required this.onTap,
    required this.onClear,
  });

  final String? summary;
  final VoidCallback onTap;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final isActive = summary != null;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: colors.card,
          border: Border.all(
            color: isActive ? colors.primaryOutline : colors.divider,
            width: isActive ? 1.4 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
                color: colors.shadow,
                blurRadius: 12,
                offset: const Offset(0, 4)),
          ],
        ),
        child: Row(
          children: [
            Icon(Icons.search, size: 18, color: colors.textSecondary),
            const SizedBox(width: 9),
            Expanded(
              child: Text(
                summary ?? 'Code postal, ville…',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  color: isActive ? colors.textPrimary : colors.textSecondary,
                  fontSize: 13.5,
                  fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                ),
              ),
            ),
            if (isActive)
              InkWell(
                onTap: onClear,
                borderRadius: BorderRadius.circular(999),
                child: Container(
                  width: 20,
                  height: 20,
                  decoration: BoxDecoration(
                      color: colors.background, shape: BoxShape.circle),
                  child:
                      Icon(Icons.close, size: 12, color: colors.textSecondary),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _TypeTabs extends StatelessWidget {
  const _TypeTabs({required this.selected, required this.onSelect});

  final String selected;
  final ValueChanged<String> onSelect;

  static const _order = ['all', 'classic', 'immediate'];

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return SizedBox(
      height: 34,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: _order.length,
        separatorBuilder: (_, __) => const SizedBox(width: 7),
        itemBuilder: (context, index) {
          final key = _order[index];
          final isOn = selected == key;

          return InkWell(
            onTap: () => onSelect(key),
            borderRadius: BorderRadius.circular(12),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14),
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: isOn ? colors.textPrimary : colors.card,
                border: Border.all(
                    color: isOn ? colors.textPrimary : colors.divider),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                replacementTypeLabels[key]!,
                style: TextStyle(
                  color: isOn ? colors.background : colors.textSecondary,
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          );
        },
      ),
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
    final subtitle = item.isMission
        ? (item.subtitle.isNotEmpty ? item.subtitle : null)
        : descriptionPreview;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.fromLTRB(14, 13, 14, 12),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: colors.divider),
            boxShadow: [
              BoxShadow(
                color: colors.shadow,
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  _TypeBadge(item: item),
                  const Spacer(),
                  if (item.isMission)
                    MissionAvatar(logoUrl: item.institutionLogoUrl, size: 30),
                ],
              ),
              if (item.isBoosted) ...[
                const SizedBox(height: 6),
                const _BoostStars(size: 13),
              ],
              const SizedBox(height: 8),
              Text(
                item.isMission ? item.title : item.role,
                style: TextStyle(
                  color: colors.textPrimary,
                  fontSize: 14.5,
                  fontWeight: FontWeight.w700,
                ),
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: colors.textSecondary, fontSize: 12),
                ),
              ],
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.only(top: 9),
                decoration: BoxDecoration(
                  border: Border(top: BorderSide(color: colors.divider)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: _MetaRow(
                        icon: Icons.location_on_outlined,
                        text: item.zipCodesLabel,
                      ),
                    ),
                    Expanded(
                      child: _MetaRow(
                        icon: Icons.calendar_today_outlined,
                        text: item.dateLabel,
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

class _TypeBadge extends StatelessWidget {
  const _TypeBadge({required this.item});

  final ReplacementItem item;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    final IconData icon;
    final String label;
    final Color background;
    final Color foreground;

    if (item.isMission) {
      icon = Icons.school_outlined;
      label = 'Mission';
      background = AppColors.mission;
      foreground = AppColors.onMission;
    } else if (item.isUrgent) {
      icon = Icons.bolt;
      label = 'Urgent';
      background = AppColors.urgent;
      foreground = AppColors.onUrgent;
    } else {
      icon = Icons.calendar_today_outlined;
      label = 'Classique';
      background = colors.background;
      foreground = colors.textSecondary;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
      decoration: BoxDecoration(
          color: background, borderRadius: BorderRadius.circular(8)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 12, color: foreground),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              color: foreground,
              fontSize: 10.5,
              fontWeight: FontWeight.w800,
              letterSpacing: .2,
            ),
          ),
        ],
      ),
    );
  }
}

class _MetaRow extends StatelessWidget {
  const _MetaRow({
    required this.icon,
    required this.text,
  });

  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Row(
      children: [
        Icon(icon, size: 14, color: colors.textSecondary),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            text,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: colors.textSecondary,
              fontSize: 12,
              fontWeight: FontWeight.w400,
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
        (_) => Icon(Icons.star, size: size, color: AppColors.boostGold),
      ),
    );
  }
}
