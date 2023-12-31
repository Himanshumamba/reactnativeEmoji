import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import React, { useRef, useState } from 'react'; 
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

import Button from './components/Button';
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import ImageViewer from './components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import CircleButton from './components/CircleButton';
import IconButton from './components/IconButton';
import EmojiPicker from './components/EmojiPicker';
import EmojiList from './components/EmojiList';
import EmojiSticker from './components/EmojiSticker';

const PlaceholderImage = require('./assets/background-image.png');

export default function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickedEmoji, setPickedEmoji] = useState(null);
const[status,requestPermission] = MediaLibrary.usePermissions();
  const [showAppOption, setShowAppOption] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
   const imageRef = useRef();
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      cancelled:true,
    });


    if (!result.cancelled) {
      setSelectedImage(result.uri);
      setShowAppOption(true);
    } else {
      alert('You did not select any image');
    }
  };


  if(status ===null){
    requestPermission();
  }
  const onReset = () => {
    setShowAppOption(false); 
   };



  const onSaveImageAsync = async () => {
    
    try {
   const localUri =await captureRef(imageRef ,{
     height:440,
     quality:1,
   }) ;

   await MediaLibrary.saveToLibraryAsync(localUri);
   if(localUri){
    alert("Saved!!")
   }

  } catch (error) {
   console.log(error);    
  }

  };
  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };
  return (
    <GestureHandlerRootView style={styles.container}>
       <View style={styles.imageContainer}>
        <View ref ={imageRef} collapsable={false}> 
             <ImageViewer placeholderImageSource={PlaceholderImage} selectedImage={selectedImage} />
             { pickedEmoji != null ? <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> :null}

             </View>
          </View>
      {showAppOption ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
          
        </View>
      ) : (
        <>
         
          <View style={styles.footerContainer}>
            <Button theme="primary" label="Choose a Photo" onPress={pickImageAsync} />
            <Button label="Use this Photo" onPress={() => setShowAppOption(true)} />
          </View>
          
        </>
      )}
    <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
    <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />

      </EmojiPicker>
      <StatusBar style="light" />
    </GestureHandlerRootView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,y
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
