import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radii.dart';
import '../../data/settings_repository.dart';
import 'settings_sheet_scaffold.dart';

class AvatarSection extends StatefulWidget {
  const AvatarSection({
    super.key,
    required this.repository,
    required this.userId,
    required this.initialImageUrl,
    required this.displayName,
    required this.subtitle,
    required this.onAvatarChanged,
    this.compact = false,
  });

  final SettingsRepository repository;
  final int userId;
  final String? initialImageUrl;
  final String displayName;
  final String subtitle;
  final Future<void> Function() onAvatarChanged;

  /// Small horizontal row instead of the big centered layout — used
  /// where the avatar is a secondary header (e.g. Settings), not the
  /// screen's main focus (e.g. Profile).
  final bool compact;

  @override
  State<AvatarSection> createState() => _AvatarSectionState();
}

class _AvatarSectionState extends State<AvatarSection> {
  bool _isBusy = false;

  Future<void> _openActions() async {
    final action = await _pickAvatarAction(context, hasPhoto: widget.initialImageUrl != null);
    if (action == null || !mounted) return;

    if (action == _AvatarAction.remove) {
      await _delete();
      return;
    }

    final picker = ImagePicker();
    final picked = await picker.pickImage(
      source: action == _AvatarAction.camera ? ImageSource.camera : ImageSource.gallery,
      imageQuality: 85,
    );
    if (picked == null || !mounted) return;

    setState(() => _isBusy = true);
    try {
      await widget.repository.updateAvatar(userId: widget.userId, filePath: picked.path);
      await widget.onAvatarChanged();
      if (mounted) showSettingsSuccessSnackBar(context, 'Photo mise à jour');
    } on ApiException catch (error) {
      if (mounted) showSettingsErrorSnackBar(context, error.message);
    } finally {
      if (mounted) setState(() => _isBusy = false);
    }
  }

  Future<void> _delete() async {
    setState(() => _isBusy = true);
    try {
      await widget.repository.deleteAvatar(userId: widget.userId);
      await widget.onAvatarChanged();
      if (mounted) showSettingsSuccessSnackBar(context, 'Photo supprimée');
    } on ApiException catch (error) {
      if (mounted) showSettingsErrorSnackBar(context, error.message);
    } finally {
      if (mounted) setState(() => _isBusy = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final initial = widget.displayName.isNotEmpty ? widget.displayName[0].toUpperCase() : '?';
    final radius = widget.compact ? 24.0 : 44.0;

    final avatar = GestureDetector(
      onTap: _isBusy ? null : _openActions,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          CircleAvatar(
            radius: radius,
            backgroundColor: colors.primaryMuted,
            backgroundImage:
                widget.initialImageUrl != null ? NetworkImage(widget.initialImageUrl!) : null,
            child: widget.initialImageUrl == null
                ? Text(
                    initial,
                    style: TextStyle(
                      color: colors.primary,
                      fontSize: widget.compact ? 17 : 30,
                      fontWeight: FontWeight.bold,
                    ),
                  )
                : null,
          ),
          if (_isBusy)
            Positioned.fill(
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.3),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: SizedBox(
                    height: widget.compact ? 16 : 22,
                    width: widget.compact ? 16 : 22,
                    child: const CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                  ),
                ),
              ),
            ),
          Positioned(
            right: -2,
            bottom: -2,
            child: Container(
              padding: EdgeInsets.all(widget.compact ? 4 : 6),
              decoration: BoxDecoration(
                color: colors.primary,
                shape: BoxShape.circle,
                border: Border.all(color: colors.background, width: 2),
              ),
              child: Icon(
                Icons.photo_camera_outlined,
                size: widget.compact ? 11 : 16,
                color: colors.onPrimary,
              ),
            ),
          ),
        ],
      ),
    );

    if (widget.compact) {
      return Row(
        children: [
          avatar,
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.displayName,
                  style:
                      TextStyle(color: colors.textPrimary, fontSize: 14.5, fontWeight: FontWeight.w700),
                ),
                Text(
                  widget.subtitle,
                  style: TextStyle(color: colors.textSecondary, fontSize: 11),
                ),
              ],
            ),
          ),
        ],
      );
    }

    return Column(
      children: [
        avatar,
        const SizedBox(height: 12),
        Text(
          widget.displayName,
          style: TextStyle(color: colors.textPrimary, fontSize: 18, fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 2),
        Text(
          widget.subtitle,
          style: TextStyle(color: colors.textSecondary, fontSize: 13),
        ),
      ],
    );
  }
}

enum _AvatarAction { gallery, camera, remove }

Future<_AvatarAction?> _pickAvatarAction(BuildContext context, {required bool hasPhoto}) {
  final colors = context.appColors;

  return showModalBottomSheet<_AvatarAction>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (sheetContext) => SafeArea(
      top: false,
      child: Container(
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(AppRadii.xl)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const SizedBox(height: 12),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: colors.divider,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            ListTile(
              leading: Icon(Icons.photo_library_outlined, color: colors.primary),
              title: const Text('Choisir depuis la galerie'),
              onTap: () => Navigator.of(sheetContext).pop(_AvatarAction.gallery),
            ),
            ListTile(
              leading: Icon(Icons.photo_camera_outlined, color: colors.primary),
              title: const Text('Prendre une photo'),
              onTap: () => Navigator.of(sheetContext).pop(_AvatarAction.camera),
            ),
            if (hasPhoto)
              ListTile(
                leading: const Icon(Icons.delete_outline, color: AppColors.coral),
                title: const Text('Supprimer la photo', style: TextStyle(color: AppColors.coral)),
                onTap: () => Navigator.of(sheetContext).pop(_AvatarAction.remove),
              ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    ),
  );
}
