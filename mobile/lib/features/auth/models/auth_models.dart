class AuthSession {
  const AuthSession({
    required this.token,
    required this.user,
  });

  final String token;
  final Map<String, dynamic> user;

  String? get displayName {
    final fullName = user['full_name'];
    if (fullName is String && fullName.isNotEmpty) {
      return fullName;
    }
    final email = user['email'];
    if (email is String && email.isNotEmpty) {
      return email;
    }
    return null;
  }

  List<String> get roles {
    final raw = user['roles'];
    if (raw is List) {
      return raw.whereType<String>().toList();
    }
    return const [];
  }
}

class LoginResult {
  const LoginResult.authenticated({
    required this.token,
  }) : requiresTwoFactor = false,
       twoFactorHash = null,
       message = null;

  const LoginResult.twoFactorRequired({
    required this.twoFactorHash,
    this.message,
  })  : requiresTwoFactor = true,
        token = null;

  final bool requiresTwoFactor;
  final String? token;
  final String? twoFactorHash;
  final String? message;
}

class TwoFactorResult {
  const TwoFactorResult({
    required this.token,
    required this.user,
  });

  final String token;
  final Map<String, dynamic> user;
}
