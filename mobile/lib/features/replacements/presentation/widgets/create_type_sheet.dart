import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../create_classic_screen.dart';
import '../create_immediate_screen.dart';
import '../../../../core/theme/app_radii.dart';

// Create replacement type selection sheet
class CreateTypeSheet extends StatelessWidget {
  const CreateTypeSheet({super.key});

  static Future<void> show(BuildContext context) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => const CreateTypeSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return SafeArea(
      top: false,
      child: Container(
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(AppRadii.md)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 12),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: colors.divider,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      'Nouveau remplacement',
                      style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: Icon(Icons.close, color: colors.textSecondary),
                  ),
                ],
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 0, 12, 12),
              child: Column(
                children: [
                  _TypeOption(
                    icon: Icons.bolt_outlined,
                    title: 'Rapide',
                    subtitle: "Besoin d'aide dès aujourd'hui",
                    highlight: true,
                    onTap: () {
                      Navigator.of(context).pop();
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const CreateImmediateScreen(),
                        ),
                      );
                    },
                  ),
                  _TypeOption(
                    icon: Icons.calendar_today_outlined,
                    title: 'Classique',
                    subtitle: 'Planifiez une période à l\'avance',
                    onTap: () {
                      Navigator.of(context).pop();
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => const CreateClassicScreen(),
                        ),
                      );
                    },
                  ),
                  Divider(height: 1, color: colors.divider),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TypeOption extends StatelessWidget {
  const _TypeOption({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.highlight = false,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final bool highlight;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(AppRadii.md),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: highlight ? colors.primaryMuted : colors.background,
                  borderRadius: BorderRadius.circular(AppRadii.md),
                ),
                child: Icon(
                  icon,
                  color: highlight ? colors.primary : colors.textPrimary,
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: TextStyle(
                          color: colors.textSecondary, fontSize: 12.5),
                    ),
                  ],
                ),
              ),
              Icon(Icons.chevron_right, color: colors.textSecondary),
            ],
          ),
        ),
      ),
    );
  }
}
