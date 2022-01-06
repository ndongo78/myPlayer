import React,{useState,useEffect,useRef} from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity,Animated, View ,Dimensions,Image,FlatList} from 'react-native'
import  Icon  from 'react-native-vector-icons/Ionicons'
import Slider from '@react-native-community/slider'
const {width, height} = Dimensions.get('window')
import { songList } from '../constants/SongList'
import TrackPlayer, {
    useTrackPlayerEvents,
    TrackPlayerEvents,
    useTrackPlayerProgress,
    useTrackPlayerState,
    State,
    Event,
    Capability,
    RepeatMode,
    usePlaybackState,
    useProgress
} from "react-native-track-player";

const stupPlaying = async () => {
    await TrackPlayer.setupPlayer()
    await TrackPlayer.add(songList)
   
}

const playSong = async (playbackState) => {
    const curentTrack = await TrackPlayer.getCurrentTrack()
    if (curentTrack !== null) {
        if(playbackState == State.Paused){
           await TrackPlayer.play()
        }else{
           await TrackPlayer.pause()
        }
    }
}
const MusicPlayer = () => {
    const [currentSong, setCurrentSong] = useState(0)

    const scrollX = useRef(new Animated.Value(0)).current
    const sliderRef=useRef(null)
    const playbackState = usePlaybackState()
    const progress=useProgress()

  
   
    

  

     const renderItem = ({item,index}) => (
        <Animated.View style={{
            width:width,
            alignItems:'center',
            justifyContent:'center',
        }}>
        <View style={styles.wrapper}>
        <Image source={item.artwork} style={styles.image}/>
        </View>
        </Animated.View>
        )

        useEffect(() => {
            stupPlaying()
             scrollX.addListener(({value})=>{
                    const currentIndex = Math.round(value / width)
                    //const song = songList[currentIndex]
                    setCurrentSong(currentIndex)
             })
             return ()=>{ scrollX.removeAllListeners()}
            
        }, [])
 
          const nextSong = () => {
              
              sliderRef.current.scrollToOffset({
                  offset: (currentSong + 1) * width,
              })
          }
          const previewSong = () => {
            sliderRef.current.scrollToOffset({
                  offset:(currentSong - 1) * width,
              })
        }

   


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.mainContainer}>
                <View style={{width:width}}>
                <Animated.FlatList
                ref={sliderRef}
                    data={songList}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    horizontal={true}
                    pagingEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={16}
                    onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }],{
                        useNativeDriver:true
                    })}
                /></View>
                <View style={{width:200}}>
                <Text style={styles.titleSong}>{songList[currentSong].title}</Text>
                <Text style={styles.artist}>{songList[currentSong].artist}</Text>
                </View>
                <View style={styles.sliderContainer}>
                <Slider
                style={styles.slider}
                value={progress.position}
                minimumValue={0}
                maximumValue={progress.duration}
                minimumTrackTintColor="#fe7e00"
                maximumTrackTintColor="#fff"
                thumbTintColor="#fe7e00"
                onSlidingComplete={async(value) => {
                  await  TrackPlayer.seekTo(value)
                }}
                />
               <View style={styles.timing}>
                 <Text style={styles.time}>0:00</Text>
                <Text style={styles.time}>3:00</Text>
               </View>
                <View style={styles.controls}>
                <TouchableOpacity style={styles.control}>
                    <Icon name="play-skip-back-outline" size={30} color="#fff" onPress={previewSong} style={{marginTop:10}} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.control} onPress={()=>playSong(playbackState)}>
                    <Icon name={playbackState ===State.Playing ?"ios-pause-circle" :"ios-play-circle"} size={50} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.control}>
                    <Icon name="play-skip-forward-outline" onPress={nextSong} size={30} color="#fff" style={{marginTop:10}} />
                </TouchableOpacity>
                </View>
                </View>
               </View>
            
            <View style={styles.bottomContainer}>
            <View style={styles.bottomControls}>
             <TouchableOpacity>
             <Icon name="heart-outline" size={25} color={'#fff'}  />
             </TouchableOpacity>
             <TouchableOpacity>
             <Icon name="ios-repeat" size={25} color={'#fff'}  />
             </TouchableOpacity>
             <TouchableOpacity>
             <Icon name="share-outline" size={25} color={'#fff'}  />
             </TouchableOpacity>
             <TouchableOpacity>
             <Icon name="ellipsis-horizontal-outline" size={25} color={'#fff'}  />
             </TouchableOpacity>
             </View>
            </View>
        </SafeAreaView>
    )
}

export default MusicPlayer

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222831',
    },
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    wrapper: {
        width: 300,
        height: 340,
        marginBottom: 20,
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 1,
    },
    image: {
        width: 300,
        height: 340,
        borderRadius: 10,
    },
    titleSong: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    artist: {
        color: '#fff',
        fontSize: 15,
        textAlign: 'center',
    },
     slider: {
        width: 350,
        height: 40,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 15,
        flexDirection: 'row',
    },
    timing: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    time: {
        color: '#fff',
        fontSize: 15,
        fontWeight: 'bold',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 25,
        alignItems: 'center',
        marginBottom: 25,
    },
    control: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    bottomContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: width,
        borderTopColor: '#fff',
        borderTopWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    bottomControls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: "80%",
    }
})
