import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

import '../../../../core/api/api_exception.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/settings_repository.dart';
import 'settings_sheet_scaffold.dart';

class AvatarSection extends StatefulWidget {
  const AvatarSection({
    super.key,
    required this.repository,
    required this.userId,
    required this.initialImageUrl,
    required this.displayName,
    required this.onAvatarChanged,
  });

  final SettingsRepository repository;
  final int userId;
  final String? initialImageUrl;
  final String displayName;
  final Future<void> Function() onAvatarChanged;

  @override
  State<AvatarSection> createState() => _AvatarSectionState();
}

class _AvatarSectionState extends State<AvatarSection> {
  bool _isBusy = false;

  Future<void> _pickAndUpload() async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: ImageSource.gallery, imageQuality: 85);
    if (picked == null || !mounted) return;

    setState(() => _isBusy = true);
    try {
      await widget.repository.updateAvatar(
        userId: widget.userId,
        filePath: picked.path,
      );
      await widget.onAvatarChanged();
      if (mounted) showSettingsSuccessSnackBar(context, 'Photo mise à jour');
    } on ApiException catch (error) {
      if (mounted) showSettingsErrorSnackBar(context, error.message);
    } finally {
      if (mounted) setState(() => _isBusy = false);
    }
  }

  Future<void> _confirmDelete() async {
    final colors = context.appColors;
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogContext) => AlertDialog(
        title: const Text('Confirmer la suppression'),
        content: const Text('Êtes-vous sûr de vouloir supprimer cette photo de profil ?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogContext).pop(false),
            child: const Text('Annuler'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: colors.primary),
            onPressed: () => Navigator.of(dialogContext).pop(true),
            child: const Text('Confirmer'),
          ),
        ],
      ),
    );

    if (confirmed != true || !mounted) return;

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

    return Row(
      children: [
        Stack(
          clipBehavior: Clip.none,
          children: [
            CircleAvatar(
              radius: 36,
              backgroundColor: colors.primaryMuted,
              backgroundImage:
                  widget.initialImageUrl != null ? NetworkImage(widget.initialImageUrl!) : null,
              child: widget.initialImageUrl == null
                  ? Text(
                      initial,
                      style: TextStyle(
                        color: colors.primary,
                        fontSize: 24,
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
                  child: const Center(
                    child: SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    ),
                  ),
                ),
              ),
          ],
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              TextButton.icon(
                onPressed: _isBusy ? null : _pickAndUpload,
                icon: const Icon(Icons.edit_outlined, size: 18),
                label: const Text('Modifier'),
              ),
              if (widget.initialImageUrl != null)
                TextButton.icon(
                  onPressed: _isBusy ? null : _confirmDelete,
                  style: TextButton.styleFrom(foregroundColor: AppColors.coral),
                  icon: const Icon(Icons.delete_outline, size: 18),
                  label: const Text('Supprimer'),
                ),
            ],
          ),
        ),
      ],
    );
  }
}
