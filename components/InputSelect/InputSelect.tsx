// import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
// import { PureComponent, useState } from 'react';
//
// type Props = {
//     title: string,
//     options: string[],
//     onSubmit: (selection: string) => void,
//     onCancel: () => void
// }
//
// type State = {
//     selection: string
// }
//
// function CustomPromptComponent(props: Props) {
//     const [selection, setSelection] = useState('');
//     const _onCancelPress = () => props.onCancel();
//
//     const _onSubmit = () => props.onSubmit(selection);
//
//     const _onOptionPressed = (option: string) => setSelection(option);
//
//     const _renderOption = (option: string) => {
//         const isSelected = selection === option;
//         const backgroundColor = isSelected ? 'blue' : 'white';
//         const color = isSelected ? 'white' : 'black';
//
//     }
//
//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>{props.title}</Text>
//             {props.options.map(renderOption => {
//                 return (
//                     <TouchableOpacity onPress={() => _onOptionPressed(renderOption)}>
//                         {_renderOption(renderOption)}
//                     </TouchableOpacity>
//                 )
//             })}
//             <View>
//                 <TouchableOpacity onPress={_onCancelPress}>
//                     <Text>Cancel</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={_onSubmit}>
//                     <Text>OK</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }
//
// const styles = StyleSheet.create({
//     container: {
//         position: 'absolute',
//         // ...
//         // ...
//     },
//     title: {
//         //...
//     }
// })
// export default CustomPromptComponent;