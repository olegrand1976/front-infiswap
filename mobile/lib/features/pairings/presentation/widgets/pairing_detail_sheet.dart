import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radii.dart';
import '../../models/pairing_item.dart';

class PairingDetailSheet extends StatefulWidget {
  const PairingDetailSheet({
    super.key,
    required this.item,
    required this.onRespond,
  });

  final PairingItem item;
  final Future<void> Function(String? description) onRespond;

  static Future<void> show(
    BuildContext context, {
    required PairingItem item,
    required Future<void> Function(String? description) onRespond,
  }) {
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => PairingDetailSheet(item: item, onRespond: onRespond),
    );
  }

  @override
  State<PairingDetailSheet> createState() => _PairingDetailSheetState();
}

class _PairingDetailSheetState extends State<PairingDetailSheet> {
  final _descriptionController = TextEditingController();
  bool _answering = false;
  bool _submitting = false;

  @override
  void dispose() {
    _descriptionController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    setState(() => _submitting = true);
    try {
      await widget.onRespond(_descriptionController.text);
      if (mounted) Navigator.of(context).pop();
    } catch (_) {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final item = widget.item;

    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.viewInsetsOf(context).bottom),
      child: Container(
        constraints:
            BoxConstraints(maxHeight: MediaQuery.sizeOf(context).height * 0.85),
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius:
              const BorderRadius.vertical(top: Radius.circular(AppRadii.md)),
        ),
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 12),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                    color: colors.divider,
                    borderRadius: BorderRadius.circular(2)),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(
                        _answering ? 'Répondre' : 'Détail de la demande',
                        style: TextStyle(
                            color: colors.textPrimary,
                            fontSize: 16,
                            fontWeight: FontWeight.w600),
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: Icon(Icons.close, color: colors.textSecondary),
                    ),
                  ],
                ),
              ),
              Flexible(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
                  child: _answering
                      ? _buildResponseForm(colors)
                      : _buildDetail(colors, item),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDetail(AppPalette colors, PairingItem item) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 48,
              height: 48,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                  color: colors.divider,
                  borderRadius: BorderRadius.circular(AppRadii.md)),
              child: Icon(Icons.person_outline,
                  color: colors.textSecondary, size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${item.zipCode} · ${item.city}',
                    style: TextStyle(
                        color: colors.textPrimary,
                        fontSize: 14.5,
                        fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    'Identité révélée après mise en relation',
                    style: TextStyle(color: colors.textSecondary, fontSize: 12),
                  ),
                ],
              ),
            ),
            if (item.isPremium)
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                    color: colors.primaryMuted,
                    borderRadius: BorderRadius.circular(999)),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.workspace_premium,
                        size: 13, color: colors.primary),
                    const SizedBox(width: 4),
                    Text('Premium',
                        style: TextStyle(
                            color: colors.primary,
                            fontSize: 11,
                            fontWeight: FontWeight.w800)),
                  ],
                ),
              ),
          ],
        ),
        const SizedBox(height: 20),
        Text('Type de demande',
            style: TextStyle(
                color: colors.primary,
                fontSize: 12.5,
                fontWeight: FontWeight.w700)),
        const SizedBox(height: 4),
        Text(pairingTypeLabels[item.type]!,
            style: TextStyle(color: colors.textPrimary, fontSize: 13.5)),
        if (item.description != null && item.description!.isNotEmpty) ...[
          const SizedBox(height: 16),
          Text('Description',
              style: TextStyle(
                  color: colors.primary,
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700)),
          const SizedBox(height: 4),
          Text(item.description!,
              style: TextStyle(
                  color: colors.textPrimary, fontSize: 13.5, height: 1.5)),
        ],
        const SizedBox(height: 20),
        if (item.hasResponded)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
                color: colors.successBg,
                borderRadius: BorderRadius.circular(AppRadii.md)),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.check_circle, size: 18, color: colors.successFg),
                const SizedBox(width: 8),
                Text('Réponse envoyée',
                    style: TextStyle(
                        color: colors.successFg, fontWeight: FontWeight.w700)),
              ],
            ),
          )
        else
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => setState(() => _answering = true),
              icon: const Icon(Icons.handshake_outlined, size: 18),
              label: const Text('Je suis intéressée'),
              style: ElevatedButton.styleFrom(
                  backgroundColor: colors.primary,
                  foregroundColor: colors.onPrimary),
            ),
          ),
      ],
    );
  }

  Widget _buildResponseForm(AppPalette colors) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Ajouter une description (optionnel)',
          style: TextStyle(
              color: colors.primary,
              fontSize: 12.5,
              fontWeight: FontWeight.w700),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: _descriptionController,
          maxLines: 4,
          decoration: const InputDecoration(hintText: 'Écrivez ici'),
        ),
        const SizedBox(height: 16),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(Icons.info_outline, size: 18, color: colors.textSecondary),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'En vous proposant comme candidate, vous témoignez de votre volonté de former un binôme avec la personne qui a posté cette demande.',
                style: TextStyle(
                    color: colors.textSecondary, fontSize: 12, height: 1.5),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _submitting ? null : _submit,
            style: ElevatedButton.styleFrom(
                backgroundColor: colors.primary,
                foregroundColor: colors.onPrimary),
            child: _submitting
                ? SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                        strokeWidth: 2, color: colors.onPrimary),
                  )
                : const Text('Enregistrer'),
          ),
        ),
      ],
    );
  }
}
