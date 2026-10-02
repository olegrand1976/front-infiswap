import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radii.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../data/google_review_repository.dart';

class GoogleReviewMenuRow extends ConsumerWidget {
  const GoogleReviewMenuRow({super.key});

  Future<void> _open(BuildContext context, WidgetRef ref) async {
    final opened = await launchUrl(
      Uri.parse(googleReviewUrl),
      mode: LaunchMode.externalApplication,
    );
    if (!opened) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Impossible d’ouvrir Google.')),
        );
      }
      return;
    }

    try {
      final value =
          await ref.read(googleReviewRepositoryProvider).markLeft('profile');
      final session = ref.read(authSessionProvider);
      if (session == null) return;
      ref.read(authSessionProvider.notifier).state =
          session.copyWithUser(withGoogleReviewLeft(session.user, value));
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => _open(context, ref),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 13, vertical: 9),
          child: Row(
            children: [
              Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  color: AppColors.boostGold,
                  borderRadius: BorderRadius.circular(AppRadii.md),
                ),
                child: const Icon(Icons.star_rounded,
                    size: 15, color: AppColors.onMint),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Évaluez-nous sur Google',
                      style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 1),
                    Text(
                      '30 secondes pour aider le réseau',
                      style:
                          TextStyle(color: colors.textSecondary, fontSize: 11),
                    ),
                  ],
                ),
              ),
              for (var i = 0; i < 5; i++)
                const Icon(Icons.star_rounded,
                    size: 12, color: AppColors.boostGold),
              const SizedBox(width: 4),
              Icon(Icons.chevron_right, size: 18, color: colors.textSecondary),
            ],
          ),
        ),
      ),
    );
  }
}
