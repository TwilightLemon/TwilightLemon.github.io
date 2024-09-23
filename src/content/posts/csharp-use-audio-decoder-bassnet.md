---
title: C# 简单地使用下 音频解码器Bass.Net
published: 2020-03-11
description: '全平台、高效、小巧的音频解码器--Bass (非商用免费) 本文教程包括音频播放 缓存 使用Fx效果器等'
image: ''
tags: [.NET]
category: '.NET'
draft: false 
lang: ''
---

在C#中有许多音频播放的方案，例如WinForm里调用系统自带MediaPlayer的COM组件和WPF的MediaPlayer(实质上还是WindowsMediaPlayer)  
以及一堆API播放和DirectX （SDK一大堆）  
于是我找到了适用于全平台、高效、小巧的音频解码器--Bass (主程序基于C++ C#可通过官方库Bass.Net调用)  

## 一、开始
首先需要到官网下载`bass.dll` 主程序文件(大约 257kb): http://www.un4seen.com/

以及类库(.Net平台调用) : 你可以在 http://www.bass.radio42.com/bass_register.html  中使用你的邮箱即可注册到一个`key`和下载`Bass.Net.dll`(大约520kb)

官方文档: http://www.bass.radio42.com/help/

>P.S: `bass.dll`需要放在程序主目录下 `Bass.Net.dll`随意(添加到程序集引用)


## 二、编码
在一切开始之前，你需要先注册程序和初始化Bass解码器:  
```csharp
using Un4seen.Bass;//添加引用
...
BassNet.Registration("你的邮箱", "你注册到的Key");
Bass.BASS_Init(-1, 44100, BASSInit.BASS_DEVICE_CPSPEAKERS, /*窗口句柄 没有的话就IntPtr.Zero*/);
```
### 1. 实现简单的mp3播放
播放mp3有2种方式 :从`文件`中加载、从`URL`中加载 

#### 例1: 从文件中加载:
``` csharp
//---------调用到的方法------------
public static int BASS_StreamCreateFile(
    string file,//文件路径
    long offset,//偏移量，一般不怎么使用
    long length,//如果你使用了偏移量，定义一个偏移量之后的读取长度
    BASSFlag flags//以什么方式创建流
)
//----------------------------------
```
帮助链接和其他信息: http://www.bass.radio42.com/help/html/e49e005c-52c0-fc33-e5f9-f27f2e0b1c1f.htm
``` csharp
//创建流的id，建议作为全局变量加入(如果是播放单文件)
private int stream =  -1024;//可以自己定义一个初始值
...
//从文件中创建一个简单的FLOAT音频流,返回流的id 便于控制和查询
stream = Bass.BASS_StreamCreateFile(你的文件完整路径, 0L, 0L, BASSFlag.BASS_SAMPLE_FLOAT);
... 开始播放
//参数:int 要播放的流的id,bool 是否在播放完成之后再重新播放
Bass.BASS_ChannelPlay(stream, false);
... 暂停播放
Bass.BASS_ChannelPause(stream);
```

#### 例2:从URL中加载:
```csharp
stream = Bass.BASS_StreamCreateURL(url, 0, BASSFlag.BASS_SAMPLE_FLOAT, null, IntPrt.Zero);
```
只是加载音频流的方式改变了，其他的一致  
如果你需要一些其他的功能(请求Url时的标头和下载回调)，请参阅以下:

##### 1.添加URL请求标头:
很简单: 在url参数里添加即可，url与每一条标头之间用"\r\n"换行，例如:
```csharp
stream = Bass.BASS_StreamCreateURL(url+"\r\n"+"一条标头，Header:Content"+"\r\n"+"再一条标头",...);
```
##### 2.下载回调: 多用于缓存

``` csharp
//必须是全局变量，否则会被GC回收！
private DOWNLOADPROC _myDownloadProc;
private FileStream _fs = null;//写入文件的流
private byte[] _data; // 本地缓存

...
//添加调用
 _myDownloadProc = new DOWNLOADPROC(DownloadCallBack);
...

//下载回调，由Bass调用
private void DownloadCallBack(IntPtr buffer, int length, IntPtr user)
        {
            // file length
            long len = Bass.BASS_StreamGetFilePosition(stream, BASSStreamFilePosition.BASS_FILEPOS_END);
            // download progress
            long down = Bass.BASS_StreamGetFilePosition(stream, BASSStreamFilePosition.BASS_FILEPOS_DOWNLOAD);
            //可在此处添加下载进度的Callback

            if (_fs == null)
            {
                // 开始下载，打开文件流
               //坑:当你切歌的时候，Bass并不会继续下载而且会向你发送已经下载完成的标识，此时你得到的文件是不完整的!所以此处先作为.cache下载
                _fs = File.OpenWrite(保存的路径 + ".cache");
            }
            if (buffer == IntPtr.Zero)
            {
                // 下载完成
                _fs.Flush();
                _fs.Close();
                _fs = null;
                FileInfo fi = new FileInfo(DLPath + ".cache");
               //如果下载不完整的话就删除.cache
                if (fi.Length != len)
                {
                    fi.Delete();
                }
                else
                {
                    //如果下载完整的话就移动到缓存(下载)目录
                    fi.MoveTo(你的路径, true);
                    //这里可以做下载完成的回调
                }
            }
            else
            {
                //接受到下载数据，实质上是Bass传来数据的指针，C#根据指针从内存中复制数据
                // increase the data buffer as needed
                if (_data == null || _data.Length < length)
                    _data = new byte[length];
                // copy from managed to unmanaged memory
                Marshal.Copy(buffer, _data, 0, length);
                // write to file
                _fs.Write(_data, 0, length);
            }
        }
```
### 2. 获得和设置一些常规数据(播放进度、声音):
#### 1. 设置、获取音量:

坑：音量的设置是暂时性的，仅对于你输入的`stream`,当你再次新建音频流时(例如切歌),音量会恢复默认!你可能需要记录下设置的音量并在下一次加载流时将音量设置Set到`stream`中!

```csharp
//设置音量 值在0~1之间 默认值为1
Bass.BASS_ChannelSetAttribute(stream, BASSAttribute.BASS_ATTRIB_VOL, value);

...

//获取当前音量 ref value
float value=0;
Bass.BASS_ChannelGetAttribute(stream, BASSAttribute.BASS_ATTRIB_VOL,ref value);
```

#### 2.播放进度和总长(时间):

``` csharp
 //长度
public TimeSpan GetLength
        {
            get
            {
                double seconds = Bass.BASS_ChannelBytes2Seconds(stream, Bass.BASS_ChannelGetLength(stream));
                return TimeSpan.FromSeconds(seconds);
            }
        }
//当前播放位置
public TimeSpan Position
        {
            get
            {
                double seconds = Bass.BASS_ChannelBytes2Seconds(stream, Bass.BASS_ChannelGetPosition(stream));
                return TimeSpan.FromSeconds(seconds);
            }
            set => Bass.BASS_ChannelSetPosition(stream, value.TotalSeconds);
        }
```

#### 3.获取FFT数据，你可以用这个数据来做频谱:

```csharp
//获取256位的FFT数据，当然你可以选择更大的，但是也足够了
//坑:暂停播放时获得的FFT数据仍是没有暂停前的数据(停留在此位置的FFT)如果你需要做频谱图，在暂停时应该手动设置为0，因为Bass并不会在暂停时返回0
float[] fft = new float[256];
Bass.BASS_ChannelGetData(stream, fft, (int)BASSData.BASS_DATA_FFT256);
```
`Bass`并没有提供播放完成的回调，你需要设置一个`Timer`来判断是否播放完成，理论上当当前位置=播放总长时算播放完成...

### 3. 更新设备和结束时
系统会将当前的默认设备放在集合的`[0]`位，但是`Bass`并不会自动更新设备也没有更新设备的事件回调（或是我没有找到?），所以你需要自己检查下有没有新的设备插入，你需要手动更新设备(如果需要):

```csharp
public void UpdataDevice()
        {
            var data = Bass.BASS_GetDeviceInfos();
            int index = -1;
            for (int i = 0; i < data.Length; i++)
                if (data[i].IsDefault)
                {
                    index = i;
                    break;
                }
            if (!data[index].IsInitialized)
                Bass.BASS_Init(index, 44100, BASSInit.BASS_DEVICE_CPSPEAKERS, wind);
            var a = Bass.BASS_ChannelGetDevice(stream);
            if (a != index)
            {
                Bass.BASS_ChannelSetDevice(stream, index);
                Bass.BASS_SetDevice(index);
            }
        }
```

结束时，需要释放流和Bass解码器:
```csharp
Bass.BASS_ChannelStop(stream);
Bass.BASS_StreamFree(stream);
Bass.BASS_Stop();
Bass.BASS_Free();
```

### 4.倍速播放和其他FX效果
为什么这里需要重新起个标题呢？  
这个方法推翻了之前用到的`stream`创建形式，但是控制播放暂停等方法不变。  
首先你需要引入几个Bass的概念:  
- 音频流:`stream`,用于播放音频，就是你控制播放暂停时传入的`stream`  
- 解码流 `decode`,用于解码音频，然后传给`Fx效果器`,`Fx效果器`会返回给你一个`音频流` 



实现此方法，你需要下载FX扩展(就在bass.dll的地方下载 选择add-on 即可),大约85kb  
添加using引用:  
```cs
using Un4seen.Bass.AddOn.Fx;
```
创建流:

```cs
//全局变量，解码流
private int decode;

decode = Bass.BASS_StreamCreateFile(你的文件, 0L, 0L, BASSFlag.BASS_STREAM_DECODE);
//相对于前面的你只需要把标签换成BASS_STREAM_DECODE即可，CreateURL亦是如此

//将解码流传入Fx效果器中，你将得到一个音频流
stream = BassFx.BASS_FX_TempoCreate(decode, BASSFlag.BASS_FX_FREESOURCE );
```

设置Fx效果:

`value`值在-90~0~5000之间  以百分制计算     例如 加速/减速 播放10%那么value=10,不用倍速播放value=0 减速 value=-10
```cs
Bass.BASS_ChannelSetAttribute(stream, BASSAttribute.BASS_ATTRIB_TEMPO, value);
```
获取Fx效果的方法和音量一致，更换标签为BASSAttribute.BASS_ATTRIB_TEMPO即可.

更多的FX效果可以参阅: http://www.bass.radio42.com/help/html/90d034c4-b426-7f7c-4f32-28210a5e6bfb.htm 原理一样 修改标签和value值即可