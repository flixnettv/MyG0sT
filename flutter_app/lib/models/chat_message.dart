class ChatMessage {
  ChatMessage({
    required this.role,
    required this.content,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  final String role;
  final String content;
  final DateTime createdAt;
}
