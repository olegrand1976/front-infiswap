import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../auth/models/auth_models.dart';

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

  static String firstNameFromUser(Map<String, dynamic> user) {
    final firstname = user['firstname']?.toString().trim();
    if (firstname != null && firstname.isNotEmpty) {
      return firstname;
    }

    final fullName = user['full_name']?.toString().trim();
    if (fullName != null && fullName.isNotEmpty) {
      return fullName.split(RegExp(r'\s+')).first;
    }

    return 'Utilisateur';
  }

  static String? profileImageUrl(Map<String, dynamic> user, String apiBaseUrl) {
    final path = user['profil_url']?.toString().trim();
    if (path == null || path.isEmpty) {
      return null;
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    final base = apiBaseUrl.endsWith('/')
        ? apiBaseUrl.substring(0, apiBaseUrl.length - 1)
        : apiBaseUrl;
    return '$base/storage/$path';
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final now = DateTime.now();
    final greeting = greetingForHour(now.hour);
    final firstName = firstNameFromUser(session.user);
    final imageUrl = profileImageUrl(session.user, apiBaseUrl);
    final dateLabel = _formatFrenchDate(now);

    return Row(
      children: [
        _ProfileAvatar(
          imageUrl: imageUrl,
          initial: firstName.isNotEmpty ? firstName[0].toUpperCase() : '?',
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '$greeting, $firstName',
                style: TextStyle(
                  color: colors.textPrimary,
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                _capitalize(dateLabel),
                style: TextStyle(
                  color: colors.textSecondary,
                  fontSize: 13,
                ),
              ),
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
    return _capitalize('$weekday ${date.day} $month');
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

    if (imageUrl != null) {
      return ClipOval(
        child: Image.network(
          imageUrl!,
          width: 56,
          height: 56,
          fit: BoxFit.cover,
          errorBuilder: (_, __, ___) => _InitialAvatar(initial: initial),
        ),
      );
    }

    return _InitialAvatar(initial: initial);
  }
}

class _InitialAvatar extends StatelessWidget {
  const _InitialAvatar({required this.initial});

  final String initial;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return CircleAvatar(
      radius: 28,
      backgroundColor: colors.primaryMuted,
      child: Text(
        initial,
        style: TextStyle(
          color: colors.primary,
          fontSize: 22,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}
