import React, { useState, useRef } from 'react';
import { Button, Container, Typography } from '@mui/material';
import APIService from '../services/APIService';

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = () => {
    if (!isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          audioChunksRef.current = [];
          setAudioUrl(URL.createObjectURL(audioBlob));
          sendAudioToBackend(audioBlob);
        };

        mediaRecorder.start();
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 15000); // Stop recording after 15 seconds

        setIsRecording(true);
      }).catch((error) => {
        console.error('Error accessing media devices.', error);
      });
    }
  };

  const handleStopRecording = () => {
    if (isRecording && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    try {
      const response = await APIService.request('/upload', 'POST', formData, true);
      console.log('Transcription received:', response.transcription);
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Audio Recorder
      </Typography>
      <Button variant="contained" color="primary" onClick={handleStartRecording} disabled={isRecording}>
        Start Recording
      </Button>
      <Button variant="contained" color="secondary" onClick={handleStopRecording} disabled={!isRecording}>
        Stop Recording
      </Button>
      {audioUrl && (
        <audio controls src={audioUrl} />
      )}
    </Container>
  );
};

export default AudioRecorder;
