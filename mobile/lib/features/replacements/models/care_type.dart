class CareType {
  const CareType({
    required this.id,
    required this.name,
  });

  final int id;
  final String name;

  factory CareType.fromJson(Map<String, dynamic> json) {
    return CareType(
      id: int.tryParse(json['id'].toString()) ?? 0,
      name: json['name']?.toString() ?? '',
    );
  }
}
