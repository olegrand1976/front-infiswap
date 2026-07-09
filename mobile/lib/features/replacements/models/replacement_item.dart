class ReplacementItem {
  const ReplacementItem({
    required this.id,
    required this.location,
    required this.dateLabel,
    required this.title,
    required this.subtitle,
    required this.role,
    required this.description,
    required this.careTypes,
    required this.periods,
    this.isUrgent = false,
    this.isBoosted = false,
    this.isMission = false,
    this.institutionName,
  });

  final String id;
  final String location;
  final String dateLabel;
  final String title;
  final String subtitle;
  final String role;
  final String description;
  final List<String> careTypes;
  final List<ReplacementPeriod> periods;
  final bool isUrgent;
  final bool isBoosted;
  final bool isMission;
  final String? institutionName;
}

class ReplacementPeriod {
  const ReplacementPeriod({
    required this.dateLabel,
    this.morning,
    this.evening,
  });

  final String dateLabel;
  final String? morning;
  final String? evening;
}

const demoReplacements = <ReplacementItem>[
  ReplacementItem(
    id: '1',
    location: 'Bruxelles, 1000',
    dateLabel: '24 – 26 mai 2025',
    title: 'Remplacement cabinet infirmier',
    subtitle: 'Infirmier · Soins à domicile',
    role: 'Infirmier',
    description:
        'Remplacement au sein d’un cabinet infirmier pour assurer la continuité des soins à domicile auprès de patients variés. Travail en autonomie avec le soutien de l’équipe.',
    careTypes: [
      'Soins d\'hygiène',
      'Soins de base',
      'Surveillance',
      'Injections',
    ],
    periods: [
      ReplacementPeriod(
        dateLabel: 'Du samedi 24 mai au lundi 26 mai 2025',
        morning: '07:00 – 13:00',
        evening: '18:00 – 22:00',
      ),
    ],
    isUrgent: true,
    isBoosted: true,
  ),
  ReplacementItem(
    id: '2',
    location: '1200 Bruxelles',
    dateLabel: '26 – 27 mai 2025',
    title: 'Mission médecine polyvalente',
    subtitle: 'Service polyvalent · Institution',
    role: 'Infirmier',
    description:
        'Remplacement en service de médecine polyvalente. Prise en charge des patients, soins quotidiens, gestion des traitements et collaboration avec l’équipe pluridisciplinaire.',
    careTypes: [
      'Médecine',
      'Soins généraux',
      'Gériatrie',
      'Soins palliatifs',
    ],
    periods: [
      ReplacementPeriod(
        dateLabel: 'Lun. 26 mai 2025',
        morning: 'Matin',
      ),
      ReplacementPeriod(
        dateLabel: 'Mar. 27 mai 2025',
        morning: 'Matin',
      ),
    ],
    isUrgent: true,
    isBoosted: true,
    isMission: true,
    institutionName: 'Clinique Saint-Luc',
  ),
  ReplacementItem(
    id: '3',
    location: 'Liège, 4000',
    dateLabel: '15 juil. 2026 · 09:00 – 17:00',
    title: 'Remplacement maison de repos',
    subtitle: 'Équipe de jour · 3 jours',
    role: 'Infirmier',
    description:
        'Remplacement en maison de repos pour assurer les soins de jour et le suivi des résidents.',
    careTypes: [
      'Soins de base',
      'Gériatrie',
    ],
    periods: [
      ReplacementPeriod(
        dateLabel: '15 juil. 2026',
        morning: '09:00 – 17:00',
      ),
    ],
  ),
];

ReplacementItem? findDemoReplacement(String id) {
  for (final item in demoReplacements) {
    if (item.id == id) {
      return item;
    }
  }
  return null;
}
