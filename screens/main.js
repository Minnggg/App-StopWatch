import React,{Component} from 'react'
import { Text, View,StyleSheet, ScrollView, Touchable, TouchableOpacity } from 'react-native'
import moment from 'moment'

function Timer({ interval, style }) {
    const pad = (n) => n < 10 ? '0' + n : n
    const duration = moment.duration(interval)
    return (
        <View style = {styles.timerContainer}>
            
            <Text style={style}>{pad(duration.minutes())}: </Text>
            <Text style={style}>{pad(duration.seconds())}, </Text>
            <Text style={style}>{pad(Math.floor(duration.milliseconds() / 10))} </Text>
           
        </View>
    )
}



function RoundButton({ title, color, background, onPress, disables }) {
    return (
        <TouchableOpacity
            activeOpacity={disables ? 1.0 : 0.7}
            onPress={() => !disables&& onPress()}
            style={[styles.button, { backgroundColor: background }]}
        >
            <View style={styles.buttonBoder}>
                <Text style={[styles.buttonTitle, { color }]}>
                    {title}
                </Text>
            </View>
        </TouchableOpacity>
    )
}


function Lap({number,interval,fastest,slowest}){

    const lapStyle = [
        styles.lapText,
        fastest&&styles.fastest,
        slowest&&styles.slowest
    ]
    return (
        <View style = {styles.lap}>
            <Text style ={lapStyle}>Lap {number}</Text>
            <Timer style ={[styles.lapTimer,lapStyle]} interval={interval}></Timer>
        </View>
    )
}


function LapTable({ laps, timer}) {
    const finishedLaps = laps.slice(1)
    let min = Number.MAX_SAFE_INTEGER
    let max = Number.MIN_SAFE_INTEGER
    if (finishedLaps.length >= 2) {
        finishedLaps.forEach(lap => {
            if (lap < min) min = lap
            if (lap > max) max = lap
        });
    }

    return (
        <ScrollView style={styles.scrollView}>
            {laps.map((lap, index) => (
                <Lap
                    number={laps.length - index}
                    interval={index === 0 ? timer +lap : lap}
                    key={laps.length - index}
                    slowest = {lap === max}
                    fastest = {lap === min}
                />
            ))}
        </ScrollView>
    )
}


export default class main extends Component{
    constructor(props){
        super(props)
        this.state = {
            start : 0,
            now:0,
            laps: [],
        }
        
    }

    start = () => {
        const now = new Date().getTime()
        this.setState({
            start : now,
            now,
            laps : [0]
        })

        this.timer  = setInterval( () => {
            this.setState({now: new Date().getTime()})
        },100)
    }

    stop = () => {
        clearInterval(this.timer)
        const {laps,now,start} = this.state
        const [firstLap,... other] = laps
        this.setState({
            laps : [firstLap + now - start, ... other],
            start : 0,
            now : 0
        })
    }
        //hàm chính
    // Lap = () => {
    //     const timestamp = new Date().getTime()
    //     const {laps,now,start} = this.state
    //     const [firstLap,... other] = laps
    //     this.setState({
    //         laps : [0,firstLap +now -start , ... other],
    //         start : timestamp,
    //         now : timestamp
    //     })
    // }

    Lap = () => {
        const timestamp = new Date().getTime()
        const {laps,now,start} = this.state
        const [firstLap,... other] = laps
        this.setState({
            laps : [0,firstLap + now -start , ... other],
            start : timestamp,
            now : timestamp
        })
    }



    reset = () => {
        this.setState({
            laps: [],
            start : 0,
            now : 0,
        })
    }
    resume = () => {
        const now = new Date().getTime()
        this.setState({
            start : now,
            now,
        })
        this.timer  = setInterval( () => {
            this.setState({now: new Date().getTime()})
        },100)
    }



    render() {
    const {now,start,laps} = this.state
    const timer = now - start
        return <View style = {styles.container}>
            <Timer style={styles.timer}  
            interval={laps.reduce((total,curr) => total + curr,0) + timer}
            />
            {laps.length ===0 && (
                <View style = {{
                    flexDirection : 'row',
                    alignSelf : 'stretch',
                    justifyContent : 'space-between',
                    marginTop : 80,
                    marginBottom : 30
                }}>
                    <RoundButton title='Reset' color='#fffff' background='#3D3D3D' onPress={()=>{}} ></RoundButton>
                    <RoundButton 
                        onPress = {this.start}
                        title='Start' 
                        color='#50D167' 
                        background='#1B361F' ></RoundButton>
                </View>
            )}

            {start > 0 && (
                <View style = {{
                    flexDirection : 'row',
                    alignSelf : 'stretch',
                    justifyContent : 'space-between',
                    marginTop : 80,
                    marginBottom : 30
                }}>
                    <RoundButton 
                        title='Lap' 
                        color='#fffff' 
                        background='#3D3D3D' 
                        onPress={this.Lap}
                        ></RoundButton>
                    <RoundButton 
                        onPress = {this.stop}
                        title='Stop' 
                        color='red' 
                        background='#3C1715' ></RoundButton>
                </View>
            )}


            {laps.length > 0 && start === 0 && (
                <View style = {{
                    flexDirection : 'row',
                    alignSelf : 'stretch',
                    justifyContent : 'space-between',
                    marginTop : 80,
                    marginBottom : 30
                }}>
                    <RoundButton 
                        title='Reset' 
                        color='#fffff' 
                        background='#3D3D3D' 
                        onPress={this.reset}
                        ></RoundButton>
                    <RoundButton 
                        onPress = {this.resume}
                        title='Resume' 
                        color='#50D167' 
                        background='#1B361F' ></RoundButton>
                </View>
            )}


            <LapTable laps={laps} timer = {timer}></LapTable>
            
        </View>
    }
}



const styles = StyleSheet.create({
    container: {
        paddingHorizontal:20,
        flex : 1,
        backgroundColor :'#0D0D0D',
        alignItems:'center',
        paddingTop : 140
    },
    timer:{
        width : 100,
        color : 'white',
        fontSize:70,
    },
    button :{ 
        width:86,
        height :86,
        borderRadius:43,
        alignItems : 'center',
        justifyContent:'center',
        alignContent:'center'
    },buttonTitle: {
        fontSize:20
    },buttonBoder :{
        width :80,
        height:80,
        borderRadius: 40,
        borderWidth:2,
        justifyContent:'center',
        alignContent:'center',
        alignItems : 'center'
    },
    lapText : {
        color :'white',
        fontSize : 18,
    },
    lapTimer : {
        width : 30
    },
    lapInterval:{
        color :'white',
        fontSize : 18

    },
    lap : {
        flexDirection:'row',
        justifyContent:'space-between',
        borderColor :'#151515',
        borderTopWidth :1,
        paddingVertical: 10,
    },
    scrollView:{
        alignSelf :'stretch'
    }, fastest :{
        color : '#4BC05F'
    },slowest :{
        color :'red'
    },
    timerContainer:{
        flexDirection : 'row'
    }
})