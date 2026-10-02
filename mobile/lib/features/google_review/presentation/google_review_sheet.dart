import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_radii.dart';
import '../../auth/providers/auth_session_provider.dart';
import '../data/google_review_repository.dart';

enum GoogleReviewSource {
  replacementAccepted('replacement_accepted', 'Remplaçant trouvé',
      'Un avis Google nous aide à faire connaître la plateforme.'),
  boost('boost', 'Votre annonce est boostée',
      'Votre avis compte pour la notoriété du réseau InfiSwap.'),
  pro('pro', 'Bienvenue dans Infiswap Premium',
      'Votre avis Google aide le réseau à attirer plus de remplaçantes.');

  const GoogleReviewSource(this.apiValue, this.title, this.subtitle);

  final String apiValue;
  final String title;
  final String subtitle;
}

Future<bool> showGoogleReviewSheetIfNeeded(
  BuildContext context,
  WidgetRef ref,
  GoogleReviewSource source,
) async {
  final session = ref.read(authSessionProvider);
  if (session == null || hasLeftGoogleReview(session.user)) return false;

  await showModalBottomSheet<void>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (_) => GoogleReviewSheet(source: source),
  );
  return true;
}

class GoogleReviewSheet extends ConsumerStatefulWidget {
  const GoogleReviewSheet({super.key, required this.source});

  final GoogleReviewSource source;

  @override
  ConsumerState<GoogleReviewSheet> createState() => _GoogleReviewSheetState();
}

class _GoogleReviewSheetState extends ConsumerState<GoogleReviewSheet> {
  bool _submitting = false;

  Future<void> _leaveReview() async {
    setState(() => _submitting = true);

    final opened = await launchUrl(
      Uri.parse(googleReviewUrl),
      mode: LaunchMode.externalApplication,
    );
    if (!opened) {
      if (!mounted) return;
      setState(() => _submitting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Impossible d’ouvrir Google.')),
      );
      return;
    }

    try {
      final value = await ref
          .read(googleReviewRepositoryProvider)
          .markLeft(widget.source.apiValue);
      final session = ref.read(authSessionProvider);
      if (session != null) {
        ref.read(authSessionProvider.notifier).state =
            session.copyWithUser(withGoogleReviewLeft(session.user, value));
      }
    } catch (_) {}

    if (mounted) Navigator.of(context).pop();
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius:
            const BorderRadius.vertical(top: Radius.circular(AppRadii.lg)),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 28, 24, 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                widget.source.title,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: colors.primary,
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                widget.source.subtitle,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: colors.textSecondary,
                  fontSize: 13,
                  height: 1.5,
                ),
              ),
              const SizedBox(height: 18),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  for (var i = 0; i < 5; i++)
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 2),
                      child: Icon(Icons.star_rounded,
                          size: 34, color: AppColors.boostGold),
                    ),
                ],
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _submitting ? null : _leaveReview,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.boostGold,
                    foregroundColor: AppColors.onMint,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadii.md),
                    ),
                  ),
                  child: _submitting
                      ? const SizedBox(
                          width: 18,
                          height: 18,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: AppColors.onMint),
                        )
                      : const Text(
                          'Laisser un avis Google',
                          style: TextStyle(
                              fontSize: 14, fontWeight: FontWeight.w800),
                        ),
                ),
              ),
              const SizedBox(height: 4),
              SizedBox(
                width: double.infinity,
                height: 44,
                child: TextButton(
                  onPressed:
                      _submitting ? null : () => Navigator.of(context).pop(),
                  child: Text(
                    'Plus tard',
                    style: TextStyle(
                      color: colors.textSecondary,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
