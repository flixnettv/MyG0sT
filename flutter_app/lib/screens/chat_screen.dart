import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/chat_provider.dart';
import '../widgets/chat_bubble.dart';
import 'settings_screen.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<ChatProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('MyGhost v2.0'),
        actions: <Widget>[
          PopupMenuButton<String>(
            onSelected: (value) => provider.switchModel(value),
            itemBuilder: (_) => const <PopupMenuEntry<String>>[
              PopupMenuItem(value: 'ace3', child: Text('ACE3')),
              PopupMenuItem(value: 'groq', child: Text('Groq')),
              PopupMenuItem(value: 'claude', child: Text('Claude')),
              PopupMenuItem(value: 'custom', child: Text('Custom')),
            ],
            icon: const Icon(Icons.memory),
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute<void>(
                builder: (_) => const SettingsScreen(),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 8, 12, 0),
            child: Row(
              children: <Widget>[
                Text(
                  'Model: ${provider.selectedModel}',
                  style: const TextStyle(color: Colors.white70),
                ),
                const Spacer(),
                TextButton(
                  onPressed: provider.clear,
                  child: const Text('Clear'),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: provider.messages.length,
              itemBuilder: (_, index) {
                final msg = provider.messages[index];
                return ChatBubble(text: msg.content, isUser: msg.role == 'user');
              },
            ),
          ),
          SafeArea(
            top: false,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Row(
                children: <Widget>[
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      style: const TextStyle(color: Colors.white),
                      decoration: const InputDecoration(
                        hintText: 'اكتب رسالتك...',
                        hintStyle: TextStyle(color: Colors.white54),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  FilledButton(
                    onPressed: provider.loading
                        ? null
                        : () {
                            final text = _controller.text;
                            _controller.clear();
                            provider.sendMessage(text);
                          },
                    child: provider.loading
                        ? const SizedBox(
                            width: 18,
                            height: 18,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.send),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
