import 'package:flutter/material.dart';

abstract final class AppColors {
  static const Color mint = Color(0xFF34D399);

  static const Color mintDark = Color(0xFF2DD4BF);

  static const Color coral = Color(0xFFF43F5E);

  static const Color onMint = Color(0xFF020617);

  static const Color onCoral = Color(0xFFFFFFFF);

  static const Color urgent = Color(0xFFE11D48);

  static const Color onUrgent = Color(0xFFFFFFFF);

  static const Color mission = Color(0xFF6D28D9);

  static const Color onMission = Color(0xFFFFFFFF);

  static const Color boostGold = Color(0xFFFBBF24);

  static const Color white = Color(0xFFFFFFFF);

  static const List<(Color, Color)> avatarPalette = [
    (Color(0xFFEDE9FE), Color(0xFF6D28D9)),
    (Color(0xFFFEF3C7), Color(0xFFB45309)),
    (Color(0xFFD1FAE5), Color(0xFF047857)),
    (Color(0xFFFFE4E6), Color(0xFFB91C1C)),
    (Color(0xFFE2E8F0), Color(0xFF475569)),
  ];
}

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
    required this.divider,
    required this.primary,
    required this.onPrimary,
    required this.secondary,
    required this.primaryMuted,
    required this.primaryOutline,
    required this.shadow,
    required this.successBg,
    required this.successFg,
    required this.pendingBg,
    required this.pendingFg,
    required this.dangerBg,
    required this.dangerFg,
  });

  final Color background;
  final Color card;
  final Color textPrimary;
  final Color textSecondary;
  final Color inputBackground;
  final Color inputBorder;
  final Color border;
  final Color divider;
  final Color primary;
  final Color onPrimary;
  final Color secondary;

  final Color primaryMuted;

  final Color primaryOutline;

  final Color shadow;

  final Color successBg;
  final Color successFg;
  final Color pendingBg;
  final Color pendingFg;
  final Color dangerBg;
  final Color dangerFg;

  static const light = AppPalette(
    background: Color(0xFFF1F5F9),
    card: Color(0xFFFFFFFF),
    textPrimary: Color(0xFF0F172A),
    textSecondary: Color(0xFF475569),
    inputBackground: Color(0xFFFFFFFF),
    inputBorder: Color(0xFFCBD5E1),
    border: Color(0xFFCBD5E1),
    divider: Color(0xFFE2E8F0),
    primary: AppColors.coral,
    onPrimary: AppColors.onCoral,
    secondary: AppColors.mint,
    primaryMuted: Color(0xFFFFE4E6),
    primaryOutline: Color(0xFFFB7185),
    shadow: Color(0x1A0F172A),
    successBg: Color(0xFFD1FAE5),
    successFg: Color(0xFF047857),
    pendingBg: Color(0xFFFEF3C7),
    pendingFg: Color(0xFFB45309),
    dangerBg: Color(0xFFFEE2E2),
    dangerFg: Color(0xFFB91C1C),
  );

  static const dark = AppPalette(
    background: Color(0xFF020617),
    card: Color(0xFF0F172A),
    textPrimary: Color(0xFFF8FAFC),
    textSecondary: Color(0xFF94A3B8),
    inputBackground: Color(0xFF0F172A),
    inputBorder: Color(0x6634D399),
    border: Color(0x6634D399),
    divider: Color(0xFF1E293B),
    primary: AppColors.mint,
    onPrimary: AppColors.onMint,
    secondary: AppColors.coral,
    primaryMuted: Color(0x1F34D399),
    primaryOutline: Color(0x8034D399),
    shadow: Color(0x00000000),
    successBg: Color(0x2934D399),
    successFg: Color(0xFF6EE7B7),
    pendingBg: Color(0x29F59E0B),
    pendingFg: Color(0xFFFBBF24),
    dangerBg: Color(0x29E11D48),
    dangerFg: Color(0xFFFB7185),
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
    Color? divider,
    Color? primary,
    Color? onPrimary,
    Color? secondary,
    Color? primaryMuted,
    Color? primaryOutline,
    Color? shadow,
    Color? successBg,
    Color? successFg,
    Color? pendingBg,
    Color? pendingFg,
    Color? dangerBg,
    Color? dangerFg,
  }) {
    return AppPalette(
      background: background ?? this.background,
      card: card ?? this.card,
      textPrimary: textPrimary ?? this.textPrimary,
      textSecondary: textSecondary ?? this.textSecondary,
      inputBackground: inputBackground ?? this.inputBackground,
      inputBorder: inputBorder ?? this.inputBorder,
      border: border ?? this.border,
      divider: divider ?? this.divider,
      primary: primary ?? this.primary,
      onPrimary: onPrimary ?? this.onPrimary,
      secondary: secondary ?? this.secondary,
      primaryMuted: primaryMuted ?? this.primaryMuted,
      primaryOutline: primaryOutline ?? this.primaryOutline,
      shadow: shadow ?? this.shadow,
      successBg: successBg ?? this.successBg,
      successFg: successFg ?? this.successFg,
      pendingBg: pendingBg ?? this.pendingBg,
      pendingFg: pendingFg ?? this.pendingFg,
      dangerBg: dangerBg ?? this.dangerBg,
      dangerFg: dangerFg ?? this.dangerFg,
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
      divider: Color.lerp(divider, other.divider, t)!,
      primary: Color.lerp(primary, other.primary, t)!,
      onPrimary: Color.lerp(onPrimary, other.onPrimary, t)!,
      secondary: Color.lerp(secondary, other.secondary, t)!,
      primaryMuted: Color.lerp(primaryMuted, other.primaryMuted, t)!,
      primaryOutline: Color.lerp(primaryOutline, other.primaryOutline, t)!,
      shadow: Color.lerp(shadow, other.shadow, t)!,
      successBg: Color.lerp(successBg, other.successBg, t)!,
      successFg: Color.lerp(successFg, other.successFg, t)!,
      pendingBg: Color.lerp(pendingBg, other.pendingBg, t)!,
      pendingFg: Color.lerp(pendingFg, other.pendingFg, t)!,
      dangerBg: Color.lerp(dangerBg, other.dangerBg, t)!,
      dangerFg: Color.lerp(dangerFg, other.dangerFg, t)!,
    );
  }
}

extension AppPaletteContext on BuildContext {
  AppPalette get appColors =>
      Theme.of(this).extension<AppPalette>() ?? AppPalette.light;
}
