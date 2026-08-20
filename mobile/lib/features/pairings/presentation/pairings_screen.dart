import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radii.dart';
import '../../../core/widgets/skeleton_box.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../data/pairings_list_notifier.dart';
import '../data/pairings_repository.dart';
import '../models/pairing_item.dart';
import '../models/pairing_search_params.dart';
import 'create_pairing_screen.dart';
import 'pairing_responses_screen.dart';
import 'widgets/pairing_detail_sheet.dart';
import 'widgets/pairing_search_sheet.dart';

class PairingsScreen extends ConsumerStatefulWidget {
  const PairingsScreen({super.key});

  @override
  ConsumerState<PairingsScreen> createState() => _PairingsScreenState();
}

class _PairingsScreenState extends ConsumerState<PairingsScreen> {
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
      ref.read(pairingsListProvider.notifier).loadMore();
    }
  }

  Future<void> _openSearchSheet(PairingSearchParams params) {
    return PairingSearchSheet.show(
      context,
      initialZipCodes: params.zipCodes,
      initialCities: params.cities,
      onApply: ({required zipCodes, required cities}) {
        ref
            .read(pairingsListProvider.notifier)
            .applySearch(zipCodes: zipCodes, cities: cities);
      },
    );
  }

  Future<void> _openCreateScreen() async {
    final created = await Navigator.of(context).push<bool>(
      MaterialPageRoute<bool>(builder: (_) => const CreatePairingScreen()),
    );
    if (created == true) {
      ref.read(pairingsListProvider.notifier).refresh();
    }
  }

  Future<void> _openDetail(PairingItem item) async {
    final currentUserId = ref.read(authSessionProvider)?.user['id'] as int?;
    if (currentUserId == null) return;

    await PairingDetailSheet.show(
      context,
      item: item,
      onRespond: (description) async {
        try {
          await ref.read(pairingsRepositoryProvider).respond(
                pairingId: item.id,
                currentUserId: currentUserId,
                description: description,
              );
          ref.read(pairingsListProvider.notifier).markResponded(item.id);
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Réponse envoyée avec succès.')),
            );
          }
        } on ApiException catch (error) {
          if (mounted) {
            ScaffoldMessenger.of(context)
                .showSnackBar(SnackBar(content: Text(error.message)));
          }
          rethrow;
        }
      },
    );
  }

  Future<void> _closeRequest(PairingItem item) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) {
        final colors = dialogContext.appColors;
        return AlertDialog(
          backgroundColor: colors.card,
          title: Text('Fermer la demande ?',
              style: TextStyle(color: colors.textPrimary)),
          content: Text(
            'Elle ne sera plus visible des autres infirmières.',
            style: TextStyle(color: colors.textSecondary),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(false),
              child: Text('Annuler',
                  style: TextStyle(color: colors.textSecondary)),
            ),
            TextButton(
              onPressed: () => Navigator.of(dialogContext).pop(true),
              child: Text('Fermer',
                  style: TextStyle(
                      color: colors.primary, fontWeight: FontWeight.w700)),
            ),
          ],
        );
      },
    );

    if (confirmed != true || !mounted) return;

    try {
      await ref.read(pairingsRepositoryProvider).close(item.id);
      ref.read(pairingsListProvider.notifier).refresh();
    } on ApiException catch (error) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(error.message)));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final asyncList = ref.watch(pairingsListProvider);
    final isLoadingMore = ref.watch(pairingsLoadingMoreProvider);
    final notifier = ref.read(pairingsListProvider.notifier);
    final params = notifier.params;
    final resultCount =
        asyncList.maybeWhen(data: (items) => items.length, orElse: () => null);

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: Stack(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.fromLTRB(8, 8, 20, 8),
                  child: _Header(
                    resultCount: resultCount,
                    hasActiveSearch: params.hasActiveSearch,
                    tab: params.tab,
                    onSearchTap: () => _openSearchSheet(params),
                    onResponsesTap: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(
                          builder: (_) => const PairingResponsesScreen()),
                    ),
                    onSelectTab: (tab) => notifier.applyTab(tab),
                    onClearSearch: notifier.clearSearch,
                  ),
                ),
                Expanded(
                  child: asyncList.when(
                    loading: () => const _ListSkeleton(),
                    error: (error, _) => _ErrorState(
                      message: error is ApiException
                          ? error.message
                          : 'Impossible de charger les binômes.',
                      onRetry: notifier.refresh,
                    ),
                    data: (items) {
                      if (items.isEmpty) {
                        return _EmptyState(
                            hasActiveSearch: params.hasActiveSearch,
                            onClear: notifier.clearSearch);
                      }
                      return RefreshIndicator(
                        color: colors.primary,
                        onRefresh: notifier.refresh,
                        child: ListView.separated(
                          controller: _scrollController,
                          padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
                          itemCount: items.length + (isLoadingMore ? 1 : 0),
                          separatorBuilder: (_, __) =>
                              const SizedBox(height: 10),
                          itemBuilder: (context, index) {
                            if (index >= items.length) {
                              return const _CardSkeleton();
                            }
                            final item = items[index];
                            return _PairingCard(
                              item: item,
                              mine: params.tab == PairingTab.mine,
                              onTap: () => _openDetail(item),
                              onClose: () => _closeRequest(item),
                            );
                          },
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
            Positioned(
              right: 20,
              bottom: 24,
              child: _CreatePairingFab(onTap: _openCreateScreen),
            ),
          ],
        ),
      ),
    );
  }
}

// Same round button as the shell's create FAB (main_shell.dart's
// _CreateFab) — a stock FloatingActionButton is a M3 rounded square, not
// a circle, and reads oversized next to the app's other round icon buttons.
class _CreatePairingFab extends StatelessWidget {
  const _CreatePairingFab({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: Container(
          width: 48,
          height: 48,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: colors.primary,
            boxShadow: [
              BoxShadow(
                color: colors.primary.withValues(alpha: 0.4),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: Icon(Icons.add, color: colors.onPrimary, size: 20),
        ),
      ),
    );
  }
}

class _Header extends StatelessWidget {
  const _Header({
    required this.resultCount,
    required this.hasActiveSearch,
    required this.tab,
    required this.onSearchTap,
    required this.onResponsesTap,
    required this.onSelectTab,
    required this.onClearSearch,
  });

  final int? resultCount;
  final bool hasActiveSearch;
  final PairingTab tab;
  final VoidCallback onSearchTap;
  final VoidCallback onResponsesTap;
  final ValueChanged<PairingTab> onSelectTab;
  final VoidCallback onClearSearch;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final canPop = Navigator.of(context).canPop();
    final countLabel = resultCount == null
        ? ' '
        : '$resultCount résultat${resultCount == 1 ? '' : 's'}';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
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
                  Text('Binômes',
                      style: TextStyle(
                          color: colors.textPrimary,
                          fontSize: 16,
                          fontWeight: FontWeight.w800)),
                  const SizedBox(height: 2),
                  Text(countLabel,
                      style: TextStyle(
                          color: colors.textSecondary, fontSize: 12.5)),
                ],
              ),
            ),
            const SizedBox(width: 8),
            _IconButton(
                icon: Icons.search,
                active: hasActiveSearch,
                onTap: onSearchTap),
            const SizedBox(width: 8),
            _IconButton(
                icon: Icons.groups_outlined,
                active: false,
                onTap: onResponsesTap),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            _Tab(
                label: 'Recherche',
                selected: tab == PairingTab.search,
                onTap: () => onSelectTab(PairingTab.search)),
            const SizedBox(width: 7),
            _Tab(
                label: 'Mes demandes',
                selected: tab == PairingTab.mine,
                onTap: () => onSelectTab(PairingTab.mine)),
            if (hasActiveSearch) ...[
              const SizedBox(width: 7),
              _ResetFilterButton(onTap: onClearSearch),
            ],
          ],
        ),
      ],
    );
  }
}

class _IconButton extends StatelessWidget {
  const _IconButton(
      {required this.icon, required this.active, required this.onTap});

  final IconData icon;
  final bool active;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadii.md),
      child: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
            color: colors.primaryMuted,
            borderRadius: BorderRadius.circular(AppRadii.md)),
        child: Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.center,
          children: [
            Icon(icon, color: colors.primary, size: 19),
            if (active)
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

class _Tab extends StatelessWidget {
  const _Tab(
      {required this.label, required this.selected, required this.onTap});

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadii.md),
      child: Container(
        height: 34,
        padding: const EdgeInsets.symmetric(horizontal: 14),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: selected ? colors.primary : colors.card,
          border: Border.all(color: selected ? colors.primary : colors.divider),
          borderRadius: BorderRadius.circular(AppRadii.md),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: selected ? colors.onPrimary : colors.textSecondary,
            fontSize: 12.5,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }
}

class _ResetFilterButton extends StatelessWidget {
  const _ResetFilterButton({required this.onTap});

  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppRadii.md),
      child: Container(
        height: 34,
        width: 34,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: colors.card,
          border: Border.all(color: colors.divider),
          borderRadius: BorderRadius.circular(AppRadii.md),
        ),
        child: Icon(Icons.close, size: 16, color: colors.textSecondary),
      ),
    );
  }
}

class _PairingCard extends StatelessWidget {
  const _PairingCard({
    required this.item,
    required this.mine,
    required this.onTap,
    required this.onClose,
  });

  final PairingItem item;
  final bool mine;
  final VoidCallback onTap;
  final VoidCallback onClose;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    // Reuse the app's existing semantic tokens rather than a new color:
    // "search" reads with the brand accent, "available" with the success
    // green already used for positive/open states elsewhere.
    final typeColor =
        item.type == PairingType.available ? colors.successFg : colors.primary;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadii.md),
        child: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: colors.card,
            borderRadius: BorderRadius.circular(AppRadii.md),
            border: Border.all(color: colors.border),
            boxShadow: [
              BoxShadow(
                  color: colors.shadow,
                  blurRadius: 10,
                  offset: const Offset(0, 3))
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Icon(Icons.location_on_outlined,
                      size: 14, color: colors.textPrimary),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      '${item.zipCode} · ${item.city}',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                          color: colors.textPrimary,
                          fontSize: 13,
                          fontWeight: FontWeight.w500),
                    ),
                  ),
                  if (item.isPremium)
                    Icon(Icons.workspace_premium,
                        size: 14, color: colors.primary),
                  if (mine) ...[
                    const SizedBox(width: 4),
                    PopupMenuButton<void>(
                      padding: EdgeInsets.zero,
                      icon: Icon(Icons.more_vert,
                          size: 18, color: colors.textSecondary),
                      itemBuilder: (_) => [
                        PopupMenuItem<void>(
                            onTap: onClose,
                            child: const Text('Fermer la demande')),
                      ],
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 3),
              Row(
                children: [
                  Icon(Icons.handshake_outlined, size: 14, color: typeColor),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      pairingTypeLabels[item.type]!,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                          color: typeColor,
                          fontSize: 12,
                          fontWeight: FontWeight.w700),
                    ),
                  ),
                  if (item.hasResponded)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                          color: colors.successBg,
                          borderRadius: BorderRadius.circular(999)),
                      child: Text(
                        'Répondue',
                        style: TextStyle(
                            color: colors.successFg,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800),
                      ),
                    ),
                ],
              ),
              if (item.description != null && item.description!.isNotEmpty) ...[
                const SizedBox(height: 6),
                Text(
                  item.description!,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: colors.textSecondary, fontSize: 12),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _ListSkeleton extends StatelessWidget {
  const _ListSkeleton();

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 96),
      itemCount: 6,
      separatorBuilder: (_, __) => const SizedBox(height: 10),
      itemBuilder: (_, __) => const _CardSkeleton(),
    );
  }
}

class _CardSkeleton extends StatelessWidget {
  const _CardSkeleton();

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(AppRadii.md),
        border: Border.all(color: colors.border),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SkeletonBox(width: 140, height: 12),
          SizedBox(height: 8),
          SkeletonBox(width: 180, height: 12),
          SizedBox(height: 8),
          SkeletonBox(width: 220, height: 11),
        ],
      ),
    );
  }
}

class _EmptyState extends StatelessWidget {
  const _EmptyState({required this.hasActiveSearch, required this.onClear});

  final bool hasActiveSearch;
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.groups_outlined, size: 38, color: colors.border),
            const SizedBox(height: 12),
            Text(
              hasActiveSearch
                  ? 'Aucun résultat pour ces critères'
                  : 'Aucune demande pour le moment',
              textAlign: TextAlign.center,
              style: TextStyle(color: colors.textSecondary),
            ),
            if (hasActiveSearch) ...[
              const SizedBox(height: 16),
              TextButton(
                onPressed: onClear,
                child: Text('Effacer la recherche',
                    style: TextStyle(color: colors.primary)),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({required this.message, required this.onRetry});

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
            Text(message,
                textAlign: TextAlign.center,
                style: const TextStyle(color: AppColors.coral)),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: onRetry,
              style: ElevatedButton.styleFrom(
                  backgroundColor: colors.primary,
                  foregroundColor: colors.onPrimary),
              child: const Text('Réessayer'),
            ),
          ],
        ),
      ),
    );
  }
}
