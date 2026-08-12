import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../auth/models/auth_models.dart';
import '../../../../core/theme/app_radii.dart';

class HomeHeader extends StatelessWidget {
  const HomeHeader({
    super.key,
    required this.session,
    required this.apiBaseUrl,
  });

  final AuthSession session;
  final String apiBaseUrl;

  static String greetingForHour(int hour) {
    if (hour < 12) {
      return 'Bonjour';
    }
    if (hour < 18) {
      return 'Bon après-midi';
    }
    return 'Bonsoir';
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final now = DateTime.now();
    final greeting = greetingForHour(now.hour);
    final firstName = session.firstName;
    final imageUrl = session.profileImageUrl(apiBaseUrl);
    final dateLabel = _capitalize(_formatFrenchDate(now));

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/logo.png',
              height: 30,
              fit: BoxFit.contain,
            ),
          ],
        ),
        const SizedBox(height: 20),
        Row(
          children: [
            _ProfileAvatar(
              imageUrl: imageUrl,
              initial: firstName.isNotEmpty ? firstName[0].toUpperCase() : '?',
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '$greeting, $firstName',
                    style: TextStyle(
                      color: colors.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      height: 1.1,
                    ),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    dateLabel,
                    style: TextStyle(
                      color: colors.textSecondary,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 5),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(AppRadii.md),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.medical_services_outlined,
                color: colors.primary,
                size: 20,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Prête pour votre prochain remplacement ?',
                  style: TextStyle(
                    color: colors.textPrimary,
                    fontSize: 15,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              )
            ],
          ),
        ),
      ],
    );
  }

  static String _capitalize(String value) {
    if (value.isEmpty) {
      return value;
    }
    return '${value[0].toUpperCase()}${value.substring(1)}';
  }

  static String _formatFrenchDate(DateTime date) {
    const weekdays = [
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
      'dimanche',
    ];
    const months = [
      'janvier',
      'février',
      'mars',
      'avril',
      'mai',
      'juin',
      'juillet',
      'août',
      'septembre',
      'octobre',
      'novembre',
      'décembre',
    ];
    final weekday = weekdays[date.weekday - 1];
    final month = months[date.month - 1];
    return '$weekday ${date.day} $month';
  }
}

class _ProfileAvatar extends StatelessWidget {
  const _ProfileAvatar({
    required this.imageUrl,
    required this.initial,
  });

  final String? imageUrl;
  final String initial;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    Widget avatar;
    if (imageUrl != null) {
      avatar = ClipOval(
        child: Image.network(
          imageUrl!,
          width: 52,
          height: 52,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => _InitialAvatar(initial: initial),
        ),
      );
    } else {
      avatar = _InitialAvatar(initial: initial);
    }

    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(
          color: colors.textPrimary.withValues(alpha: 0.15),
          width: 2,
        ),
      ),
      child: avatar,
    );
  }
}

class _InitialAvatar extends StatelessWidget {
  const _InitialAvatar({required this.initial});

  final String initial;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return CircleAvatar(
      radius: 26,
      backgroundColor: colors.primaryMuted,
      child: Text(
        initial,
        style: TextStyle(
          color: colors.primary,
          fontSize: 20,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
