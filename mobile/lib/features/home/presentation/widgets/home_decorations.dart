import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

abstract final class HomeDecorations {
  static bool isDark(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark;

  static BoxDecoration card(
    BuildContext context, {
    Color? accent,
    double radius = 16,
  }) {
    final colors = context.appColors;
    final dark = isDark(context);
    final borderColor = accent ?? colors.primaryOutline;

    return BoxDecoration(
      color: colors.card,
      borderRadius: BorderRadius.circular(radius),
      border: Border.all(
        color: dark ? borderColor.withValues(alpha: 0.45) : colors.border,
      ),
      boxShadow: dark
          ? [
              BoxShadow(
                color: (accent ?? colors.primary).withValues(alpha: 0.12),
                blurRadius: 16,
                spreadRadius: -4,
              ),
            ]
          : [
              BoxShadow(
                color: colors.shadow,
                blurRadius: 10,
                offset: const Offset(0, 3),
              ),
            ],
    );
  }

  static BoxDecoration searchField(BuildContext context) {
    final colors = context.appColors;
    final dark = isDark(context);

    return BoxDecoration(
      color: colors.inputBackground,
      borderRadius: BorderRadius.circular(16),
      border: Border.all(
        color: dark
            ? colors.secondary.withValues(alpha: 0.55)
            : colors.inputBorder,
        width: dark ? 1.5 : 1,
      ),
      boxShadow: dark
          ? [
              BoxShadow(
                color: colors.secondary.withValues(alpha: 0.15),
                blurRadius: 20,
                spreadRadius: -6,
              ),
            ]
          : null,
    );
  }

  static Color accentCoral(BuildContext context) => AppColors.coral;

  static Color accentMint(BuildContext context) => AppColors.mint;
}
