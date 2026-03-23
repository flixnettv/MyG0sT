import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'providers/chat_provider.dart';
import 'screens/chat_screen.dart';
import 'services/api_service.dart';
import 'theme/app_theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final provider = ChatProvider(apiService: ApiService(baseUrl: 'http://10.0.2.2:3000'));
  await provider.init();

  runApp(MyGhostApp(provider: provider));
}

class MyGhostApp extends StatelessWidget {
  const MyGhostApp({required this.provider, super.key});

  final ChatProvider provider;

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<ChatProvider>.value(
      value: provider,
      child: MaterialApp(
        title: 'MyGhost',
        debugShowCheckedModeBanner: false,
        theme: buildAppTheme(),
        home: const ChatScreen(),

void main() {
  runApp(const MyGhostApp());
}

class MyGhostApp extends StatelessWidget {
  const MyGhostApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MyGhost',
      home: Scaffold(
        appBar: AppBar(title: const Text('MyGhost v2.0')),
        body: const Center(child: Text('Flutter app scaffold is ready')),
      ),
    );
  }
}
