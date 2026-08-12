import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radii.dart';
import '../../../replacements/presentation/create_classic_screen.dart';
import '../../../replacements/presentation/my_replacements_screen.dart';
import '../../../shell/providers/shell_tab_index_provider.dart';
import 'home_decorations.dart';

class HomeQuickActions extends ConsumerWidget {
  const HomeQuickActions({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final actions = [
      _QuickAction(
        icon: Icons.search,
        title: 'Rechercher',
        description: 'Compléter votre tournée avec un remplacement.',
        cta: 'Rechercher',
        color: AppColors.coral,
        onTap: () => ref.read(shellTabIndexProvider.notifier).state = 1,
      ),
      _QuickAction(
        icon: Icons.person_add_alt_outlined,
        title: 'Me faire remplacer',
        description: 'Publier une offre sur votre tournée.',
        cta: 'Demander',
        color: const Color(0xFF059669),
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute<void>(builder: (_) => const CreateClassicScreen()),
        ),
      ),
      _QuickAction(
        icon: Icons.groups_outlined,
        title: 'Candidats',
        description: 'Voir les réponses positives à vos offres.',
        cta: 'Consulter',
        color: AppColors.mission,
        onTap: () => Navigator.of(context).push(
          MaterialPageRoute<void>(builder: (_) => const MyReplacementsScreen()),
        ),
      ),
      _QuickAction(
        icon: Icons.fact_check_outlined,
        title: 'Mes accords',
        description: 'Remplacements où vous avez postulé.',
        cta: 'Accéder',
        color: const Color(0xFFB45309),
        onTap: () => context.push('/applications'),
      ),
    ];

    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      mainAxisSpacing: 10,
      crossAxisSpacing: 10,
      childAspectRatio: 1.4,
      children:
          actions.map((action) => _QuickActionCard(action: action)).toList(),
    );
  }
}

class _QuickAction {
  const _QuickAction({
    required this.icon,
    required this.title,
    required this.description,
    required this.cta,
    required this.color,
    required this.onTap,
  });

  final IconData icon;
  final String title;
  final String description;
  final String cta;
  final Color color;
  final VoidCallback onTap;
}

class _QuickActionCard extends StatelessWidget {
  const _QuickActionCard({required this.action});

  final _QuickAction action;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Container(
      padding: const EdgeInsets.all(13),
      decoration: HomeDecorations.card(context, radius: AppRadii.md),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 26,
                height: 26,
                decoration: BoxDecoration(
                  color: action.color,
                  borderRadius: BorderRadius.circular(AppRadii.md),
                ),
                child: Icon(action.icon, color: Colors.white, size: 13),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  action.title,
                  style: TextStyle(
                    color: colors.textPrimary,
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Expanded(
            child: Text(
              action.description,
              style: TextStyle(
                color: colors.textSecondary,
                fontSize: 10.5,
                height: 1.4,
              ),
            ),
          ),
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: action.onTap,
              borderRadius: BorderRadius.circular(AppRadii.md),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(vertical: 8),
                decoration: BoxDecoration(
                  color: action.color,
                  borderRadius: BorderRadius.circular(AppRadii.md),
                ),
                alignment: Alignment.center,
                child: Text(
                  action.cta,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 11.5,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
