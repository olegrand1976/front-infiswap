import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radii.dart';

class MissionAvatar extends StatelessWidget {
  const MissionAvatar({
    super.key,
    this.logoUrl,
    this.name,
    this.size = 28,
  });

  final String? logoUrl;
  final String? name;
  final double size;

  static String? _initialsOf(String? rawName) {
    final trimmed = rawName?.trim();
    if (trimmed == null || trimmed.isEmpty) {
      return null;
    }
    final parts = trimmed.split(RegExp(r'\s+'));
    final first = parts.first[0];
    final last =
        parts.length > 1 && parts.last.isNotEmpty ? parts.last[0] : '';
    return (first + last).toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    final url = logoUrl?.trim();
    final hasLogo = url != null && url.isNotEmpty;
    final colors = context.appColors;

    if (!hasLogo) {
      return _fallback(colors);
    }

    return ClipOval(
      child: SizedBox(
        width: size,
        height: size,
        child: Image.network(
          url,
          fit: BoxFit.cover,
          width: size,
          height: size,
          gaplessPlayback: true,
          errorBuilder: (_, __, ___) => _fallback(colors),
          loadingBuilder: (context, child, progress) {
            if (progress == null) {
              return child;
            }
            return Container(
              width: size,
              height: size,
              color: colors.primaryMuted,
              alignment: Alignment.center,
              child: SizedBox(
                width: size * 0.35,
                height: size * 0.35,
                child: CircularProgressIndicator(
                  strokeWidth: 1.5,
                  color: colors.primary,
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  // Tier 2: no logo but a name — colored initials, same pattern as
  // candidate avatars (AppColors.avatarPalette, picked by name.hashCode).
  // Tier 3: no logo and no name — generic building icon.
  Widget _fallback(AppPalette colors) {
    final initials = _initialsOf(name);
    if (initials == null) {
      return _BuildingFallback(size: size, colors: colors);
    }
    const palette = AppColors.avatarPalette;
    final (bg, fg) = palette[name!.hashCode.abs() % palette.length];
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(AppRadii.md),
      ),
      alignment: Alignment.center,
      child: Text(
        initials,
        style: TextStyle(
          color: fg,
          fontSize: size * 0.42,
          fontWeight: FontWeight.w800,
        ),
      ),
    );
  }
}

class _BuildingFallback extends StatelessWidget {
  const _BuildingFallback({required this.size, required this.colors});

  final double size;
  final AppPalette colors;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: colors.primaryMuted,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Icon(
        Icons.apartment_outlined,
        size: size * 0.5,
        color: colors.primary,
      ),
    );
  }
}
