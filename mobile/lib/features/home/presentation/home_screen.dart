import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/api/api_exception.dart';
import '../../../core/config/app_config.dart';
import '../../../core/theme/app_colors.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../../replacements/models/dashboard_replacements_summary.dart';
import '../../replacements/models/replacement_item.dart';
import '../../replacements/presentation/replacement_detail_screen.dart';
import '../data/home_dashboard_notifier.dart';
import 'widgets/home_content_rails.dart';
import 'widgets/home_header.dart';
import 'widgets/home_quick_actions.dart';
import 'widgets/home_search_bar.dart';
import 'widgets/home_stats_row.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;
    final session = ref.watch(authSessionProvider);
    final asyncDashboard = ref.watch(homeDashboardProvider);
    final notifier = ref.read(homeDashboardProvider.notifier);
    final apiBaseUrl = ref.watch(appConfigProvider).apiBaseUrl;

    if (session == null) {
      return Scaffold(
        backgroundColor: colors.background,
        body: Center(
          child: CircularProgressIndicator(color: colors.primary),
        ),
      );
    }

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: asyncDashboard.when(
          loading: () => Center(
            child: CircularProgressIndicator(color: colors.primary),
          ),
          error: (error, _) => _ErrorState(
            message: error is ApiException
                ? error.message
                : 'Impossible de charger le tableau de bord.',
            onRetry: notifier.refresh,
          ),
          data: (dashboard) {
            final summary = dashboard.replacements;
            void onCardTap(ReplacementItem item) {
              Navigator.of(context).push(
                MaterialPageRoute<void>(
                  builder: (_) => ReplacementDetailScreen(item: item),
                ),
              );
            }

            return RefreshIndicator(
              color: colors.primary,
              onRefresh: notifier.refresh,
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                children: [
                  HomeHeader(
                    session: session,
                    apiBaseUrl: apiBaseUrl,
                  ),
                  const SizedBox(height: 20),
                  const HomeSearchBar(),
                  const SizedBox(height: 20),
                  HomeStatsRow(stats: dashboard.stats),
                  const SizedBox(height: 24),
                  const HomeQuickActions(),
                  const SizedBox(height: 24),
                  HomeReplacementsRail(
                    items: _replacementsRailItems(summary),
                    total: summary.replacementsTotal,
                    onCardTap: onCardTap,
                  ),
                  const SizedBox(height: 24),
                  HomeMissionsRail(
                    items: summary.missions,
                    total: summary.missionsTotal,
                    onCardTap: onCardTap,
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

const _replacementsRailTargetCount = 6;

// Boosted first, always — then top up with the most recent open
// replacements (deduplicated) until the rail has a decent number of cards,
// since boosted alone is often just one or two items.
List<ReplacementItem> _replacementsRailItems(DashboardReplacementsSummary summary) {
  final items = <ReplacementItem>[...summary.boostedReplacements];
  final seenIds = items.map((item) => item.id).toSet();

  for (final item in summary.recentReplacements) {
    if (items.length >= _replacementsRailTargetCount) break;
    if (seenIds.contains(item.id)) continue;
    items.add(item);
    seenIds.add(item.id);
  }

  return items;
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
