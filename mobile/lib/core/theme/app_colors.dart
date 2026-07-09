import 'package:flutter/material.dart';

/// Couleurs de marque (hex Tailwind).
abstract final class AppColors {
  /// emerald-400
  static const Color mint = Color(0xFF34D399);

  /// teal-400
  static const Color mintDark = Color(0xFF2DD4BF);

  /// rose-500
  static const Color coral = Color(0xFFF43F5E);

  /// Texte sur mint (slate-950).
  static const Color onMint = Color(0xFF020617);

  /// Texte sur coral.
  static const Color onCoral = Color(0xFFFFFFFF);
}

/// Palette sémantique selon le thème.
///
/// - Clair : primary = rose (coral), secondary = mint
/// - Sombre : primary = mint, secondary = coral
///
/// Bordure focus input + curseur = toujours [primary].
@immutable
class AppPalette extends ThemeExtension<AppPalette> {
  const AppPalette({
    required this.background,
    required this.card,
    required this.textPrimary,
    required this.textSecondary,
    required this.inputBackground,
    required this.inputBorder,
    required this.border,
    required this.primary,
    required this.onPrimary,
    required this.secondary,
  });

  final Color background;
  final Color card;
  final Color textPrimary;
  final Color textSecondary;
  final Color inputBackground;
  final Color inputBorder;
  final Color border;
  final Color primary;
  final Color onPrimary;
  final Color secondary;

  static const light = AppPalette(
    background: Color(0xFFF8FAFC),
    card: Color(0xFFFFFFFF),
    textPrimary: Color(0xFF0F172A),
    textSecondary: Color(0xFF64748B),
    inputBackground: Color(0xFFF1F5F9),
    inputBorder: Color(0x4DF43F5E),
    border: Color(0xFFE2E8F0),
    primary: AppColors.coral,
    onPrimary: AppColors.onCoral,
    secondary: AppColors.mint,
  );

  static const dark = AppPalette(
    background: Color(0xFF020617),
    card: Color(0xFF0F172A),
    textPrimary: Color(0xFFF8FAFC),
    textSecondary: Color(0xFF94A3B8),
    inputBackground: Color(0x990F172A),
    inputBorder: Color(0x4D34D399),
    border: Color(0x4D34D399),
    primary: AppColors.mint,
    onPrimary: AppColors.onMint,
    secondary: AppColors.coral,
  );

  @override
  AppPalette copyWith({
    Color? background,
    Color? card,
    Color? textPrimary,
    Color? textSecondary,
    Color? inputBackground,
    Color? inputBorder,
    Color? border,
    Color? primary,
    Color? onPrimary,
    Color? secondary,
  }) {
    return AppPalette(
      background: background ?? this.background,
      card: card ?? this.card,
      textPrimary: textPrimary ?? this.textPrimary,
      textSecondary: textSecondary ?? this.textSecondary,
      inputBackground: inputBackground ?? this.inputBackground,
      inputBorder: inputBorder ?? this.inputBorder,
      border: border ?? this.border,
      primary: primary ?? this.primary,
      onPrimary: onPrimary ?? this.onPrimary,
      secondary: secondary ?? this.secondary,
    );
  }

  @override
  AppPalette lerp(ThemeExtension<AppPalette>? other, double t) {
    if (other is! AppPalette) {
      return this;
    }
    return AppPalette(
      background: Color.lerp(background, other.background, t)!,
      card: Color.lerp(card, other.card, t)!,
      textPrimary: Color.lerp(textPrimary, other.textPrimary, t)!,
      textSecondary: Color.lerp(textSecondary, other.textSecondary, t)!,
      inputBackground: Color.lerp(inputBackground, other.inputBackground, t)!,
      inputBorder: Color.lerp(inputBorder, other.inputBorder, t)!,
      border: Color.lerp(border, other.border, t)!,
      primary: Color.lerp(primary, other.primary, t)!,
      onPrimary: Color.lerp(onPrimary, other.onPrimary, t)!,
      secondary: Color.lerp(secondary, other.secondary, t)!,
    );
  }
}

extension AppPaletteContext on BuildContext {
  AppPalette get appColors =>
      Theme.of(this).extension<AppPalette>() ?? AppPalette.light;
}
