import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';

class MissionAvatar extends StatelessWidget {
  const MissionAvatar({
    super.key,
    this.logoUrl,
    this.size = 28,
  });

  final String? logoUrl;
  final double size;

  @override
  Widget build(BuildContext context) {
    final url = logoUrl?.trim();
    final hasLogo = url != null && url.isNotEmpty;

    if (!hasLogo) {
      return _BuildingFallback(size: size);
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
          errorBuilder: (_, __, ___) => _BuildingFallback(size: size),
          loadingBuilder: (context, child, progress) {
            if (progress == null) {
              return child;
            }
            return Container(
              width: size,
              height: size,
              color: AppColors.mint.withValues(alpha: 0.08),
              alignment: Alignment.center,
              child: SizedBox(
                width: size * 0.35,
                height: size * 0.35,
                child: const CircularProgressIndicator(
                  strokeWidth: 1.5,
                  color: AppColors.mint,
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _BuildingFallback extends StatelessWidget {
  const _BuildingFallback({required this.size});

  final double size;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: AppColors.mint.withValues(alpha: 0.12),
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Icon(
        Icons.apartment_outlined,
        size: size * 0.5,
        color: AppColors.mint,
      ),
    );
  }
}
