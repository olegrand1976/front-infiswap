class NetworkGroup {
  const NetworkGroup({
    required this.id,
    required this.name,
    required this.isAdmin,
  });

  final int id;
  final String name;
  final bool isAdmin;

  factory NetworkGroup.fromJson(Map<String, dynamic> json) {
    return NetworkGroup(
      id: int.tryParse(json['id']?.toString() ?? '') ?? 0,
      name: (json['name'] as String?)?.trim() ?? '',
      isAdmin: json['role_name'] == 'administrator',
    );
  }
}
