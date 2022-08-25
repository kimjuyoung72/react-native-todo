import React,{useState} from 'react';
import styled, {ThemeProvider} from 'styled-components/native';
import theme from './theme';
import { StatusBar, Dimensions } from 'react-native';
import Input from './components/Input';
// import { images } from './images';
// import IconButton from './component/IconButton';
import Task from './components/Task';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading';

const Container = styled.View`
  flex: 1;
  background-color: ${({theme})=>theme.background};
  justify-content: flex-start;
  align-items: center;
`;
const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  color: ${({theme})=>theme.main};
  align-self: flex-start;
  margin: 0 20px;
`;
const List = styled.ScrollView`
  flex: 1;
  width: ${({width}) => width - 40}px;
  
`;
// const tempData = {
//   '1': { id: '1', text: 'todo 1', completed: false},
//   '2': { id: '2', text: 'todo 2', completed: true},
//   '3': { id: '3', text: 'todo 3', completed: false},
//   '4': { id: '4', text: 'todo 4', completed: false},
// }
export default function App() {
  const [isReady, setIsReady] = useState(false); //앱 실행준비 상태
  const [newTask, setNewTask] = useState('');   //새로운 항목
  const [tasks, setTasks] = useState('');       //항목 리스트

  const width = Dimensions.get('window').width;
  
  // 로컬 저장소에서 데이터 저장하기
  const storeData = async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value)
      await AsyncStorage.setItem(key, jsonValue)
      setTasks(value);
    } catch (e) {
      // saving error
    }
  }
  // 로컬 저장소에서 데이터 가져오기
  const getData = async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key)
      console.log(jsonValue);
      const tasks = jsonValue != null ? JSON.parse(jsonValue) : {};
      setTasks(tasks);
    } catch(e) {
      console.log('데이터 가져오기:'+jsonValue);
    }
  }
  // 로컬 저장소 삭제 by key
  const removeValue = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch(e) {
      // remove error
    }
      
    console.log('항목삭제:'+key);
  }
  //전체 삭제
  const clearAll = async () => {
    try {
      await AsyncStorage.clear()
    } catch(e) {
      // clear error
    }
  
    console.log('전체 삭제 Done.')
  }
  // const _loadTasks = async () => {
  //   const loadedTasks = await AsyncStorage.getItem('tasks');
  //   setTasks(JSON.parse(loadedTasks || '{}'));
  // }

  // 추가
  const _addTask = () => {
    // alert(`Add: ${newTask}`);
    const ID = Date.now().toString();
    // const ID = Symbol();

    const newTaskObject = {
      [ID]: { id: ID, text: newTask, completed: false},
    };

    // setTasks({ ...tasks, ...newTaskObject }); //스프레드로 객체 합성
    storeData('tasks', { ...tasks, ...newTaskObject });  //로컬 저장소에 객체 저장.
    setNewTask('');
  };
  const _handleTextChange = text => {
    // alert('입력중');
    setNewTask(text);
  }
  // 삭제
  const _deleteTask = (id) => {
    // delete tasks[id];  //직접 삭제할 수 없다. setter를 통해..
    const currentTasks = {...tasks};  //객체 복사
    delete currentTasks[id];
    
    // setTasks(currentTasks); //tasks 교체
    storeData('tasks', currentTasks);  //로컬 저장소에 객체 저장.
  };
  //완료
  const _toggleTask = (id) => {
    const currentTasks = {...tasks};
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    // console.log(currentTasks[id].completed);
    // setTasks(currentTasks);
    storeData('tasks', currentTasks);  //로컬 저장소에 객체 저장.
  };
  //수정
  const _updateTask = task => {
    const currentTasks = {...tasks}; //객체 복사
    currentTasks[task.id] = task;
    // setTasks(currentTasks);
    storeData('tasks', currentTasks);  //로컬 저장소에 객체 저장.
  }
  // 입력필드에 포커스가 떠났을때
  const _onBlur = () => {
    setNewTask('');
  };
  return !isReady ? (
    <AppLoading
      // 앱 로딩전 실행할 로직     
      startAsync={getData('tasks')}
      //startAsync호출이 성공적으로 수행되면
      onFinish={() => setIsReady(true)}
      //startAsync호출이 실패하면
      onError={console.error}
   />
  ):(
  <ThemeProvider theme={theme}>
    <Container>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.background}
      />
      <Title>TODO LIST</Title>
      <Input 
        value={newTask}
        placeholder='+ Add a Task'
        onChangeText={_handleTextChange}
        onSubmitEditing={_addTask}
        onBlur={_onBlur}
      />
      <List width={width}>
        {Object.values(tasks)
               .reverse()
               .map(task=><Task key={task.id}
                                task={task} 
                                deleteTask={_deleteTask}
                                toggleTask={_toggleTask}
                                updateTask={_updateTask}
                          />)
        }
      </List>
    </Container>
  </ThemeProvider>
);
}

