import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radii.dart';

/// Referral share card, matching the "Collègues inscrits via votre
/// parrainage" block on the web nurse dashboard.
class HomeReferralCard extends StatelessWidget {
  const HomeReferralCard({
    super.key,
    required this.referralsCount,
    required this.shareUrl,
  });

  final int? referralsCount;
  final String shareUrl;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Color.alphaBlend(
            colors.secondary.withValues(alpha: .1), colors.card),
        borderRadius: BorderRadius.circular(AppRadii.md),
        border: Border.all(color: colors.secondary.withValues(alpha: .3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Collègues inscrits via votre parrainage',
            style: TextStyle(
              color: colors.textPrimary,
              fontSize: 13,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 2),
          Text(
            'Partagez InfiSwap — plus le réseau grandit, plus vous trouvez de remplacements.',
            style: TextStyle(
                color: colors.textSecondary, fontSize: 10.5, height: 1.4),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Container(
                width: 42,
                height: 42,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [AppColors.mint, AppColors.mintDark],
                  ),
                  borderRadius: BorderRadius.circular(AppRadii.md),
                ),
                child: const Icon(Icons.people_alt_outlined,
                    color: Colors.white, size: 19),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    referralsCount?.toString() ?? '—',
                    style: TextStyle(
                      color: colors.textPrimary,
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      height: 1,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'collègues inscrits',
                    style: TextStyle(color: colors.textSecondary, fontSize: 10),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.fromLTRB(12, 3, 3, 3),
            decoration: BoxDecoration(
              color: colors.background,
              borderRadius: BorderRadius.circular(AppRadii.md),
              border: Border.all(color: colors.border),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    shareUrl,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style:
                        TextStyle(color: colors.textSecondary, fontSize: 10.5),
                  ),
                ),
                Material(
                  color: Colors.transparent,
                  child: InkWell(
                    borderRadius: BorderRadius.circular(AppRadii.md),
                    onTap: () => _copy(context),
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 11, vertical: 8),
                      decoration: BoxDecoration(
                        color: colors.secondary,
                        borderRadius: BorderRadius.circular(AppRadii.md),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.copy, size: 11, color: Colors.black87),
                          SizedBox(width: 5),
                          Text(
                            'Copier',
                            style: TextStyle(
                              color: Colors.black87,
                              fontSize: 10.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _copy(BuildContext context) async {
    await Clipboard.setData(ClipboardData(text: shareUrl));
    if (!context.mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Lien copié avec succès')),
    );
  }
}
