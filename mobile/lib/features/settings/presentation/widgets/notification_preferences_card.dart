import 'package:flutter/material.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/settings_repository.dart';
import '../../models/settings_models.dart';
import 'settings_sheet_scaffold.dart';

class NotificationPreferencesCard extends StatefulWidget {
  const NotificationPreferencesCard({
    super.key,
    required this.repository,
    required this.initial,
  });

  final SettingsRepository repository;
  final NotificationPreferences initial;

  @override
  State<NotificationPreferencesCard> createState() =>
      _NotificationPreferencesCardState();
}

class _NotificationPreferencesCardState
    extends State<NotificationPreferencesCard> {
  late NotificationPreferences _prefs;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _prefs = widget.initial;
  }

  Future<void> _update(NotificationPreferences next) async {
    final previous = _prefs;
    setState(() {
      _prefs = next;
      _isSaving = true;
    });

    try {
      await widget.repository.updateNotificationPreferences(next);
    } on ApiException catch (error) {
      if (mounted) {
        setState(() => _prefs = previous);
        showSettingsErrorSnackBar(context, error.message);
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _NotificationSwitchTile(
          title: 'Nouveau remplacement',
          value: _prefs.newReplacement,
          enabled: !_isSaving,
          onChanged: (v) => _update(_prefs.copyWith(newReplacement: v)),
        ),
        _NotificationSwitchTile(
          title: 'Remplacement accepté',
          value: _prefs.replacementAccepted,
          enabled: !_isSaving,
          onChanged: (v) => _update(_prefs.copyWith(replacementAccepted: v)),
        ),
        _NotificationSwitchTile(
          title: 'Résumé hebdomadaire (ma zone)',
          value: _prefs.digestWeekly,
          enabled: !_isSaving,
          onChanged: (v) => _update(_prefs.copyWith(digestWeekly: v)),
        ),
        _NotificationSwitchTile(
          title: 'Urgences uniquement',
          value: _prefs.urgentOnly,
          enabled: !_isSaving,
          onChanged: (v) => _update(_prefs.copyWith(urgentOnly: v)),
        ),
        _NotificationSwitchTile(
          title: 'SMS urgences',
          value: _prefs.smsUrgent,
          enabled: !_isSaving,
          onChanged: (v) => _update(_prefs.copyWith(smsUrgent: v)),
        ),
      ],
    );
  }
}

class _NotificationSwitchTile extends StatelessWidget {
  const _NotificationSwitchTile({
    required this.title,
    required this.value,
    required this.enabled,
    required this.onChanged,
  });

  final String title;
  final bool value;
  final bool enabled;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Expanded(
            child: Text(
              title,
              style: TextStyle(
                color: colors.textPrimary,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Transform.scale(
            scale: 0.8,
            child: Switch(
              value: value,
              activeThumbColor: colors.onPrimary,
              activeTrackColor: colors.primary,
              onChanged: enabled ? onChanged : null,
            ),
          ),
        ],
      ),
    );
  }
}
