import Phaser from 'phaser';
import React, { useRef, useState, useEffect } from 'react';
import ballImage from './assets/image/ball.png';
import backgroundImage from './assets/image/background.jpg';
import tickSound from './assets/js/audio/tick.mp3';

const PhaserGame = ({ sessionId, counter, onGameEnd, startTime }) => {
  const gameRef = useRef(null);
  const [currentCounter, setCurrentCounter] = useState(counter);
  const [sessionActive, setSessionActive] = useState(false);
  const [audioContextResumed, setAudioContextResumed] = useState(false);
  const [gameEndTime, setGameEndTime] = useState(null);
  const [soundPlaying, setSoundPlaying] = useState(false);

  useEffect(() => {
    if (currentCounter <= 0 && soundPlaying) {
      gameRef.current?.scene?.tickSound?.stop();
      setSoundPlaying(false);
    }

    if (currentCounter <= 0 && !gameEndTime) {
      const endTime = new Date();
      setGameEndTime(endTime);
      onGameEnd(sessionId, endTime);
      setSessionActive(false);
    }
  }, [currentCounter, soundPlaying, gameEndTime, onGameEnd, sessionId]);

  const startGame = () => {
    if (!audioContextResumed) {
      if (Phaser.Sound.Context) {
        Phaser.Sound.Context.resume().then(() => {
          setAudioContextResumed(true);
        }).catch(error => {
          console.error("Error resuming audio context:", error);
        });
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
        },
      },
      scene: {
        preload,
        create,
        update,
      },
    };

    gameRef.current = new Phaser.Game(config);

    function preload() {
      this.load.image('ball', ballImage);
      this.load.image('background', backgroundImage);
      this.load.audio('tick', tickSound);
    }

    function create() {
      this.add.image(400, 300, 'background');
      this.ball = this.physics.add.image(400, 300, 'ball')
        .setVelocity(100, 200)
        .setBounce(1, 1)
        .setCollideWorldBounds(true)
        .setScale(0.1);

      this.tickSound = this.sound.add('tick');

      this.time.addEvent({
        delay: 1000,
        callback: onTick,
        callbackScope: this,
        loop: true
      });

      setSessionActive(true);
    }

    function onTick() {
      setCurrentCounter(prevCounter => {
        if (prevCounter > 0) {
          if (!soundPlaying) {
            this.tickSound.play();
            setSoundPlaying(true);
          }
          return prevCounter - 1;
        } else {
          if (soundPlaying) {
            this.tickSound.stop();
            setSoundPlaying(false);
          }
          return 0;
        }

      });
    }

    function update() {
      // Ball will automatically move and bounce due to physics configuration
    }
  };

  return (
    <>
      <button onClick={startGame}>Start Session</button>
      <div>
        <p>Session ID: {sessionId}</p>
        <p>Start Time: {startTime.toLocaleTimeString()}</p>
        <p>End Time: {gameEndTime ? gameEndTime.toLocaleTimeString() : 'Not Ended'}</p>
        <p>Counter: {currentCounter}</p> 
      </div>
      <div id="phaser-container" />
    </>
  );
};

export default PhaserGame;
