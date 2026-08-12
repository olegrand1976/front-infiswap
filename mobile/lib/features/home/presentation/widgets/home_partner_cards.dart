import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radii.dart';
import 'home_decorations.dart';

/// NursTech / NursAssur partner offer cards, matching the web nurse
/// dashboard's `NurstechPresentation` component. Hidden per-product once
/// the nurse's `site` / `insurance` flag is already active.
class HomePartnerCards extends StatelessWidget {
  const HomePartnerCards({
    super.key,
    required this.webBaseUrl,
    required this.showNursTech,
    required this.showNursAssur,
  });

  final String webBaseUrl;
  final bool showNursTech;
  final bool showNursAssur;

  @override
  Widget build(BuildContext context) {
    if (!showNursTech && !showNursAssur) {
      return const SizedBox.shrink();
    }

    return Column(
      children: [
        if (showNursTech)
          _PartnerCard(
            accent: AppColors.nursTech,
            // No NursTech logo on mobile — a neutral icon stands in for it.
            mark: const Icon(Icons.language, color: Colors.white, size: 19),
            title: 'Créez votre page web pro',
            subtitle: 'formules dès 450 €.',
            primaryLabel: 'Demander mon devis page web',
            secondaryLabel: 'Être rappelé sous 24h',
            onTap: () =>
                _open('$webBaseUrl/nurstech-by-infiswap#information-form'),
          ),
        if (showNursTech && showNursAssur) const SizedBox(height: 10),
        if (showNursAssur)
          _PartnerCard(
            accent: AppColors.nursAssur,
            mark: const Text(
              'NursAssur',
              style: TextStyle(
                color: Colors.white,
                fontSize: 12,
                fontWeight: FontWeight.w800,
              ),
            ),
            markPadding: const EdgeInsets.symmetric(horizontal: 10),
            title: 'RC pro et prévoyance',
            subtitle: 'devis sous 48h.',
            primaryLabel: 'Voir mon offre RC pro',
            secondaryLabel: 'Parler à un conseiller',
            onTap: () => _open('$webBaseUrl/nursassur-by-infiswap#quote'),
          ),
      ],
    );
  }

  static Future<void> _open(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }
}

class _PartnerCard extends StatelessWidget {
  const _PartnerCard({
    required this.accent,
    required this.mark,
    required this.title,
    required this.subtitle,
    required this.primaryLabel,
    required this.secondaryLabel,
    required this.onTap,
    this.markPadding,
  });

  final Color accent;
  final Widget mark;
  final EdgeInsets? markPadding;
  final String title;
  final String subtitle;
  final String primaryLabel;
  final String secondaryLabel;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration:
          HomeDecorations.card(context, accent: accent, radius: AppRadii.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              Container(
                height: 38,
                padding: markPadding ?? EdgeInsets.zero,
                width: markPadding == null ? 38 : null,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: accent,
                  borderRadius: BorderRadius.circular(11),
                ),
                child: mark,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    Text(
                      subtitle,
                      style: TextStyle(
                        color: colors.textSecondary,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              _PartnerButton(label: primaryLabel, color: accent, onTap: onTap),
              _PartnerButton(
                  label: secondaryLabel,
                  color: accent,
                  onTap: onTap,
                  ghost: true),
            ],
          ),
        ],
      ),
    );
  }
}

class _PartnerButton extends StatelessWidget {
  const _PartnerButton({
    required this.label,
    required this.color,
    required this.onTap,
    this.ghost = false,
  });

  final String label;
  final Color color;
  final VoidCallback onTap;
  final bool ghost;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(9),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(9),
            border: ghost ? null : Border.all(color: color, width: 1.5),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 11,
              fontWeight: FontWeight.w700,
              decoration:
                  ghost ? TextDecoration.underline : TextDecoration.none,
            ),
          ),
        ),
      ),
    );
  }
}
