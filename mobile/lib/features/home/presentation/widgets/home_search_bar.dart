import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radii.dart';
import '../../../shell/providers/shell_tab_index_provider.dart';
import 'home_decorations.dart';

class HomeSearchBar extends ConsumerWidget {
  const HomeSearchBar({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final colors = context.appColors;

    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => ref.read(shellTabIndexProvider.notifier).state = 1,
        borderRadius: BorderRadius.circular(AppRadii.md),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: HomeDecorations.searchField(context),
          child: Row(
            children: [
              Icon(
                Icons.search,
                color: colors.primary,
                size: 22,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Rechercher un remplacement…',
                  style: TextStyle(
                    color: colors.textSecondary,
                    fontSize: 14,
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
