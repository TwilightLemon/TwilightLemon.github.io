---
title: C++ 使用MIDI库演奏《晴天》
published: 2025-02-13
description: '谨以此篇献给我的一位好伙伴'
image: './images/2025213-sunnydays.jpg'
tags: [C++,Windows]
category: 'C++'
draft: false 
---
:::note[题记]
那些在MIDI库里徘徊的十六分音符  
终究没能拼成告白的主歌  

我把周杰伦的《晴天》写成C++的类  
在每个midiEvent里埋藏故事的小黄花  

调试器的断点比初恋更漫长  
而青春不过是一串未导出的cmake工程文件  

在堆栈溢出的夜晚  
终将明白  
有些旋律永远停在#pragma once的注释里  
有些人永远停在未定义的引用里  

或许你我的心跳终归运行在不同的时钟频率  
却愿始终记得如何编译出一场永不落幕的晴天  
:::

::github{repo="TwilightLemon/SunnyDays"}  
就像在题记里说的一样，这是一个从未导出成功的工程文件。  
所以如果你也想听听，可以在PowerShell里运行以下指令：
```shell
git clone https://github.com/TwilightLemon/SunnyDays
cd SunnyDays
mkdir build
cd build
cmake .. -G "MinGW Makefiles"
mingw32-make
./SunnyDays.exe
```
~~没环境？巧了，她也如是说。~~  

下面来简单讲讲如何使用C++和MIDI库作曲吧。

## 一、开始工作
###  引入MIDI库和相关控制类
- 在```CMakeLists.txt```中：
    ```CMakeLists
    target_link_libraries(SunnyDays winmm)
    ```
- 在```MIDIHelper.h```中：
    ```h
    #include <windows.h>
    #pragma comment(lib,"winmm.lib")
    ```
- 定义Scale(音阶), Instrument(乐器, 仅包括部分)等枚举。我把Drum单独提了出来。
    ```cpp
    enum Scale
    {
        X1 = 36, X2 = 38, X3 = 40, X4 = 41, X5 = 43, X6 = 45, X7 = 47,
        L1 = 48, L2 = 50, L3 = 52, L4 = 53, L5 = 55, L6 = 57, L7 = 59,
        M1 = 60, M2 = 62, M3 = 64, M4 = 65, M5 = 67, M6 = 69, M7 = 71,
        H1 = 72, H2 = 74, H3 = 76, H4 = 77, H5 = 79, H6 = 81, H7 = 83,
        LOW_SPEED = 500, MIDDLE_SPEED = 400, HIGH_SPEED = 300,
        _ = 0XFF
    };
    enum Drum{
        BassDrum = 36, SnareDrum = 38, ClosedHiHat = 42, OpenHiHat = 46
    };
    enum Instrument{
        AcousticGrandPiano = 0, BrightAcousticPiano = 1,
        ElectricGrandPiano = 2, HonkyTonkPiano = 3,
        ElectricPiano1 = 4, ElectricPiano2 = 5
    };
    ```
- 一些基础方法，包括初始化/关闭设备、设置参数、播放单个音符和播放和弦等。
    ```h
    void initDevice();
    void closeDevice();
    void setInstrument(int channel, int instrument);
    void setVolume(int channel, int volume);

    void PlayNote(HMIDIOUT handle, UINT channel, UINT note, UINT velocity);

    void playChord(HMIDIOUT handle, UINT channel, UINT note1, UINT note2, UINT note3, UINT note4, UINT velocity);

    void playChord(HMIDIOUT handle, UINT channel, UINT note1, UINT note2, UINT note3, UINT velocity);
    ```
    在```MIDIHelper.cpp```中：
    ```cpp
    void initDevice(){
        midiOutOpen(&hMidiOut, 0, 0, 0, CALLBACK_NULL);
    }

    void closeDevice(){
        midiOutClose(hMidiOut);
    }

    void setInstrument(int channel,int instrument){
        if (channel > 15 || instrument > 127) return;
        DWORD message = 0xC0 | channel | (instrument << 8);
        midiOutShortMsg(hMidiOut, message);
    }

    void setVolume(int channel,int volume){
        if (channel > 15 || volume > 127) return;
        DWORD message = 0xB0 | channel | (7 << 8) | (volume << 16);
        midiOutShortMsg(hMidiOut, message);
    }

    //播放单个音符，note是音符，velocity是力度
    void PlayNote(HMIDIOUT handle, UINT channel, UINT note, UINT velocity) {
        if (channel > 15 || note > 127 || velocity > 127) return;
        DWORD message = 0x90 | channel | (note << 8) | (velocity << 16);
        midiOutShortMsg(handle, message);
    }

    //四指和弦
    void playChord(HMIDIOUT handle, UINT channel, UINT note1, UINT note2, UINT note3, UINT note4, UINT velocity){
        if (channel > 15 || note1 > 127 || note2 > 127 || note3 > 127 || note4 > 127 || velocity > 127) return;
        DWORD message1 = 0x90 | channel | (note1 << 8) | (velocity << 16);
        DWORD message2 = 0x90 | channel | (note2 << 8) | (velocity << 16);
        DWORD message3 = 0x90 | channel | (note3 << 8) | (velocity << 16);
        DWORD message4 = 0x90 | channel | (note4 << 8) | (velocity << 16);
        midiOutShortMsg(handle, message1);
        midiOutShortMsg(handle, message2);
        midiOutShortMsg(handle, message3);
        midiOutShortMsg(handle, message4);
    }

    //三指和弦
    void playChord(HMIDIOUT handle, UINT channel, UINT note1, UINT note2, UINT note3, UINT velocity) {
        if (channel > 15 || note1 > 127 || note2 > 127 || note3 > 127 || velocity > 127) return;
        DWORD message1 = 0x90 | channel | (note1 << 8) | (velocity << 16);
        DWORD message2 = 0x90 | channel | (note2 << 8) | (velocity << 16);
        DWORD message3 = 0x90 | channel | (note3 << 8) | (velocity << 16);
        midiOutShortMsg(handle, message1);
        midiOutShortMsg(handle, message2);
        midiOutShortMsg(handle, message3);
    }
    ```
### 初始化和结束
先在头文件中定义一个全局MIDI句柄:
```h
extern HMIDIOUT hMidiOut;
```
在入口处初始化MIDI设备并在结束时关闭：
```cpp
HMIDIOUT hMidiOut;
int main() {
    initDevice();
    //...
    closeDevice();
    return 0;
}
```

初始化MIDI设备之后，为每一个乐器分配一个通道```channel```（0~15，通常9分配给打击类乐器,例如鼓组），控制音量```volume```，然后就可以开始演奏了。

## 二、自制简易乐谱
以```Voice.cpp```为例,定义一个数组为频谱，控制停顿和音符，遍历数组播放：
```cpp
namespace SunnyDays{
    int channelVoice=1;
    void playVoice(int note, int velocity){
        PlayNote(hMidiOut, channelVoice, note, velocity);
    }
    void voice(){
        Sleep(13100);//等待前奏
        int sleep = 390;
        int data[] =
                {
                    //故事的小黄花
                    -90,
                    300,M5,M5,M1,M1,_,M2,M3,_,
                    //从出生那年就飘着
                    -90,
                    M5,M5,M1,M1,0,M2,M3,300,M2,M1,_,
                    //童年的荡秋千
                    -90,
                    300,M5,M5,M1,M1,_,M2,M3,_,
                    //随记忆一直晃到现在
                    -90,  
                    M3,_,500,M2,M3,M4,M3,M2,M4,M3,700,M2,700,_,
                    //...
                }
        for (auto i : data) {
            if(i==-30){logTime("Enter chorus");continue;}//调试用
            if(i==-90){NextLyric(); continue;}
            if (i == 0) { sleep = 180; continue; }
            //...
            if (i == _) {
                Sleep(390);
                continue;
            }

            playVoice(i, 80);
            Sleep(sleep);
        }
    }
}
```
打个鼓：
```cpp
namespace SunnyDays{
    int channelBassDrum=9;

    void playDrum(int note, int velocity, int duration){
        PlayNote(hMidiOut, channelBassDrum, note, velocity);
        if(duration>0) {
            Sleep(duration);
            PlayNote(hMidiOut, channelBassDrum, note, 0);
        }
    }

    void bassDrum(){
        Sleep(11260);
        cout<<"Drum Bass Start!"<<endl;
        playDrum(SnareDrum,100,180);
        playDrum(SnareDrum,100,210);
        playDrum(BassDrum, 100, 210);
        playDrum(SnareDrum,100,190);
        playDrum(BassDrum, 100, 210);
        playDrum(SnareDrum,100,200);
        playDrum(SnareDrum,100,200);
        playDrum(OpenHiHat,100,-1);
        Sleep(200);
        //...
    }
}
```
简易副歌和弦，是从B站一位up主那里学的（已经忘记是哪位了qwq）：
```cpp
namespace SunnyDays {
    int channelChord=2;
    void chordLevel(int level,int sleep,int repeat=2,int vel=70){
        repeat--;
        int down=8;
        if(level==1){
            //一级和弦 加右指
            playChord(hMidiOut, channelChord, M1, M3, M5, L1, vel);
            while(repeat--) {
                Sleep(sleep);
                playChord(hMidiOut, channelChord, M1, M3, M5, vel - down);
            }
        }else if(level==3){
            //三级和弦 加右指
            playChord(hMidiOut, channelChord, M3, M5, M7, L3, vel);
            while(repeat--) {
                Sleep(sleep);
                playChord(hMidiOut, channelChord, M3, M5, M7, vel - down);
            }
        }
        //...
    }
    void chord(){
        Sleep(63724);
        int sleep=740;
        int data[]={
                //刮风这天 我试过握着你手
                1,4,
                6,4,
                //但偏偏 雨渐渐
                4,2,
                5,2,
                //大到我看你不见
                1,4,
                //还有多久 我才能
                3,4,
                //↑ 在你身边
                6,4,
                //↓ 等到放晴的那天
                4,4,
                //↑ 也许我会比较好一点
                5,4,
                //..
        }
        int count=sizeof(data)/sizeof(int);
        for(int i=0;i<count;i+=2){
            cout<<"chord "<<data[i]<<"  x"<<data[i+1]<<endl;
            chordLevel(data[i],sleep,data[i+1]);
            Sleep(sleep);
        }
        //...
    }
}
```

## 三、合成演奏
我用了一个笨蛋方法，用多线程单独控制每一个通道，然后在主线程中调用：
```cpp
int main(){
    //...
    initDevice();
    //设置音量
    setVolume(channelChord,80);
    setVolume(channelMainLine,80);
    setVolume(channelVoice,120);
    setVolume(channelBassDrum,80);

    //设置乐器（特定音色）
    setInstrument(channelChord,ElectricPiano1);
    setInstrument(channelMainLine,ElectricPiano1);


    system("pause");//按下回车，就开始啦
    beginLogger();


    thread t0(voice);
    thread t1(mainLine);
    thread t2(bassDrum);
    thread t3(chord);
    t0.join();
    t1.join();
    t2.join();
    t3.join();

    closeDevice();
    //...
}
```

（最后叠个甲，俺不懂音乐制作，更不会什么C++😿）