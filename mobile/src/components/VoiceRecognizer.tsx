import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export interface VoiceRecognizerRef {
  startListening: (lang?: string) => void;
  stopListening: () => void;
}

interface VoiceRecognizerProps {
  onSpeechStart?: () => void;
  onSpeechResult?: (transcript: string) => void;
  onSpeechPartial?: (partialTranscript: string) => void;
  onSpeechError?: (error: string) => void;
  onSpeechEnd?: () => void;
}

const HTML_SPEECH_BRIDGE = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="background: transparent; margin: 0; padding: 0;">
  <script>
    let recognition = null;
    let isListening = false;

    function sendToNative(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      }
    }

    function initRecognition(lang) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        sendToNative({ type: 'ERROR', error: 'Speech Recognition not supported on this device engine.' });
        return null;
      }

      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = lang || 'ta-IN';
      rec.maxAlternatives = 1;

      rec.onstart = function() {
        isListening = true;
        sendToNative({ type: 'START' });
      };

      rec.onresult = function(event) {
        let interim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          sendToNative({ type: 'RESULT', text: finalTranscript });
        } else if (interim) {
          sendToNative({ type: 'PARTIAL', text: interim });
        }
      };

      rec.onerror = function(event) {
        sendToNative({ type: 'ERROR', error: event.error || 'Recognition error' });
      };

      rec.onend = function() {
        isListening = false;
        sendToNative({ type: 'END' });
      };

      return rec;
    }

    window.startSpeech = function(lang) {
      try {
        if (recognition) {
          try { recognition.abort(); } catch(e) {}
        }
        recognition = initRecognition(lang);
        if (recognition) {
          recognition.start();
        }
      } catch (err) {
        sendToNative({ type: 'ERROR', error: err.message || 'Failed to start microphone' });
      }
    };

    window.stopSpeech = function() {
      try {
        if (recognition) {
          recognition.stop();
        }
      } catch(e) {}
    };
  </script>
</body>
</html>
`;

export const VoiceRecognizer = forwardRef<VoiceRecognizerRef, VoiceRecognizerProps>(
  ({ onSpeechStart, onSpeechResult, onSpeechPartial, onSpeechError, onSpeechEnd }, ref) => {
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      startListening: (lang: string = 'ta-IN') => {
        webViewRef.current?.injectJavaScript(`window.startSpeech('${lang}'); true;`);
      },
      stopListening: () => {
        webViewRef.current?.injectJavaScript(`window.stopSpeech(); true;`);
      },
    }));

    const handleMessage = (event: any) => {
      try {
        const data = JSON.parse(event.nativeEvent.data);
        switch (data.type) {
          case 'START':
            onSpeechStart?.();
            break;
          case 'PARTIAL':
            onSpeechPartial?.(data.text);
            break;
          case 'RESULT':
            onSpeechResult?.(data.text);
            break;
          case 'ERROR':
            onSpeechError?.(data.error);
            break;
          case 'END':
            onSpeechEnd?.();
            break;
          default:
            break;
        }
      } catch (err) {
        console.warn('VoiceRecognizer parse error:', err);
      }
    };

    return (
      <View style={styles.hiddenContainer} pointerEvents="none">
        <WebView
          ref={webViewRef}
          source={{ html: HTML_SPEECH_BRIDGE }}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          onMessage={handleMessage}
          style={styles.hiddenWebView}
        />
      </View>
    );
  }
);

const styles = StyleSheet.create({
  hiddenContainer: {
    width: 0,
    height: 0,
    opacity: 0,
    position: 'absolute',
  },
  hiddenWebView: {
    width: 0,
    height: 0,
  },
});
