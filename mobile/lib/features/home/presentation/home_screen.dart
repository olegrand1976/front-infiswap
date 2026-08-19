import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../core/config/app_config.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radii.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../../subscription/data/subscription_repository.dart';
import '../../subscription/presentation/premium_screen.dart';
import '../data/home_dashboard_notifier.dart';
import '../models/user_activity_stats.dart';
import 'widgets/home_header.dart';
import 'widgets/home_partner_cards.dart';
import 'widgets/home_premium_teaser_card.dart';
import 'widgets/home_quick_actions.dart';
import 'widgets/home_referral_card.dart';
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
    final config = ref.watch(appConfigProvider);
    final apiBaseUrl = config.apiBaseUrl;
    final isPremium = ref.watch(proStatusProvider).valueOrNull?.isPremium ?? false;

    if (session == null) {
      return Scaffold(
        backgroundColor: colors.background,
        body: Center(
          child: CircularProgressIndicator(color: colors.primary),
        ),
      );
    }

    final user = session.user;
    final referralCode = user['referral_code']?.toString() ?? '';
    final shareUrl = '${config.webBaseUrl}/register/?referral=$referralCode';
    final stats = asyncDashboard.valueOrNull;
    final isLoadingStats = asyncDashboard.isLoading && stats == null;
    final hasStatsError = asyncDashboard.hasError && stats == null;

    return Scaffold(
      backgroundColor: colors.background,
      body: SafeArea(
        child: RefreshIndicator(
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
              const SizedBox(height: 16),
              if (isLoadingStats)
                const HomeStatsRowSkeleton()
              else if (hasStatsError)
                _StatsErrorState(onRetry: notifier.refresh)
              else
                HomeStatsRow(stats: stats ?? const UserActivityStats()),
              if (!isPremium) ...[
                const SizedBox(height: 16),
                HomePremiumTeaserCard(
                  onTap: () => Navigator.of(context).push(
                    MaterialPageRoute<void>(builder: (_) => const PremiumScreen()),
                  ),
                ),
              ],
              const SizedBox(height: 16),
              const HomeQuickActions(),
              const SizedBox(height: 16),
              HomePartnerCards(
                webBaseUrl: config.webBaseUrl,
                showNursTech: !_isPartnerActive(user['site']),
                showNursAssur: !_isPartnerActive(user['insurance']),
              ),
              const SizedBox(height: 16),
              HomeReferralCard(
                referralsCount: stats?.referralsCount,
                shareUrl: shareUrl,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Mirrors web's `isPartnerProductActive`: a nurse already has the
/// NursTech / NursAssur product once their `site` / `insurance` flag is on.
bool _isPartnerActive(Object? flag) {
  return flag == true || flag == 1;
}

class _StatsErrorState extends StatelessWidget {
  const _StatsErrorState({required this.onRetry});

  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(AppRadii.md),
        border: Border.all(color: colors.divider),
      ),
      child: Row(
        children: [
          Expanded(
            child: Text(
              'Statistiques indisponibles.',
              style: TextStyle(color: colors.textSecondary, fontSize: 13),
            ),
          ),
          TextButton(
            onPressed: onRetry,
            child: Text(
              'Réessayer',
              style: TextStyle(color: colors.primary, fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }
}
