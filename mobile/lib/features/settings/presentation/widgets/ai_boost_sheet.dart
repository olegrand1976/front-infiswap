import 'package:flutter/material.dart';

import '../../../../core/location/location_repository.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_radii.dart';
import 'settings_sheet_scaffold.dart';

Future<List<(String, String)>?> showAiBoostSheet({
  required BuildContext context,
  required LocationRepository locationRepository,
  required List<String> seedZipCodes,
  required String country,
  required List<String> excludeZipCodes,
  required List<String> excludeCities,
}) {
  return showSettingsSheet<List<(String, String)>>(
    context: context,
    title: 'Boost IA',
    bodyBuilder: (_) => _AiBoostBody(
      future: _firstSuggestions(
        locationRepository: locationRepository,
        seedZipCodes: seedZipCodes,
        country: country,
        excludeZipCodes: excludeZipCodes,
        excludeCities: excludeCities,
      ),
    ),
  );
}

Future<(String?, List<(String, String)>)> _firstSuggestions({
  required LocationRepository locationRepository,
  required List<String> seedZipCodes,
  required String country,
  required List<String> excludeZipCodes,
  required List<String> excludeCities,
}) async {
  for (final seed in seedZipCodes) {
    final items = await locationRepository.getNearbyLocalities(
      zipCode: seed,
      country: country,
      excludeZipCodes: excludeZipCodes,
      excludeCities: excludeCities,
    );
    if (items.isNotEmpty) return (seed, items);
  }
  return (null, <(String, String)>[]);
}

class _AiBoostBody extends StatefulWidget {
  const _AiBoostBody({required this.future});

  final Future<(String?, List<(String, String)>)> future;

  @override
  State<_AiBoostBody> createState() => _AiBoostBodyState();
}

class _AiBoostBodyState extends State<_AiBoostBody> {
  List<(String, String)>? _suggestions;
  String? _seed;
  final Set<int> _selected = {};
  bool _failed = false;

  @override
  void initState() {
    super.initState();
    widget.future.then((result) {
      if (!mounted) return;
      final (seed, items) = result;
      setState(() {
        _seed = seed;
        _suggestions = items;
        _selected.addAll(List.generate(items.length, (i) => i));
      });
    }).catchError((Object _) {
      if (mounted) setState(() => _failed = true);
    });
  }

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final suggestions = _suggestions;
    final allSelected =
        suggestions != null && _selected.length == suggestions.length;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Text(
          'Codes postaux et villes suggérés autour de votre zone. Cochez ceux à ajouter à vos préférences.',
          style: TextStyle(
              color: colors.textSecondary, fontSize: 12.5, height: 1.45),
        ),
        const SizedBox(height: 16),
        if (_failed)
          const _Message(text: 'Impossible de charger les suggestions.')
        else if (suggestions == null)
          Column(
            children: [
              const SizedBox(height: 12),
              CircularProgressIndicator(color: colors.primary),
              const SizedBox(height: 12),
              const _Message(
                  text:
                      'La recherche peut prendre plusieurs secondes. Veuillez patienter…'),
            ],
          )
        else if (suggestions.isEmpty)
          const _Message(text: 'Aucune suggestion à afficher')
        else ...[
          Row(
            children: [
              Expanded(
                child: Text(
                  _seed == null ? 'Suggestions' : 'Autour de $_seed',
                  style: TextStyle(
                      color: colors.primary,
                      fontSize: 13,
                      fontWeight: FontWeight.w800),
                ),
              ),
              TextButton(
                style: TextButton.styleFrom(minimumSize: const Size(0, 44)),
                onPressed: () => setState(() {
                  if (allSelected) {
                    _selected.clear();
                  } else {
                    _selected
                        .addAll(List.generate(suggestions.length, (i) => i));
                  }
                }),
                child: Text(
                  allSelected ? 'Tout décocher' : 'Tout cocher',
                  style: TextStyle(
                      color: colors.textSecondary, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (var i = 0; i < suggestions.length; i++)
                _SuggestionPill(
                  label: '${suggestions[i].$1} · ${suggestions[i].$2}',
                  selected: _selected.contains(i),
                  onTap: () => setState(() {
                    if (!_selected.remove(i)) _selected.add(i);
                  }),
                ),
            ],
          ),
        ],
        const SizedBox(height: 20),
        Row(
          children: [
            Expanded(
              child: OutlinedButton(
                onPressed: () => Navigator.of(context).pop(),
                style: OutlinedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                  side: BorderSide(color: colors.border),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadii.md)),
                ),
                child: Text('Annuler',
                    style: TextStyle(
                        color: colors.textSecondary,
                        fontWeight: FontWeight.w700)),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: ElevatedButton(
                onPressed: suggestions == null || _selected.isEmpty
                    ? null
                    : () => Navigator.of(context).pop([
                          for (final i in _selected.toList()..sort())
                            suggestions[i],
                        ]),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                  backgroundColor: colors.primary,
                  foregroundColor: colors.onPrimary,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(AppRadii.md)),
                ),
                child: Text('Ajouter (${_selected.length})',
                    style: const TextStyle(fontWeight: FontWeight.w800)),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _SuggestionPill extends StatelessWidget {
  const _SuggestionPill({
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final colors = context.appColors;
    final foreground = selected ? colors.onPrimary : colors.textPrimary;

    return Material(
      color: selected ? colors.primary : Colors.transparent,
      shape: StadiumBorder(
        side: BorderSide(color: selected ? colors.primary : colors.border),
      ),
      child: InkWell(
        onTap: onTap,
        customBorder: const StadiumBorder(),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (selected) ...[
                Icon(Icons.check, size: 14, color: foreground),
                const SizedBox(width: 6),
              ],
              Text(
                label,
                style: TextStyle(
                  color: foreground,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _Message extends StatelessWidget {
  const _Message({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Text(
        text,
        textAlign: TextAlign.center,
        style: TextStyle(color: context.appColors.textSecondary, fontSize: 13),
      ),
    );
  }
}
