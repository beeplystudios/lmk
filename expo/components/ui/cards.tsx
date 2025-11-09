import Ionicons from "@expo/vector-icons/Ionicons";
import type { TRPCRouterOutputs } from "@lmk/server";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
  const styleAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: prog.value }],
    };
  });

  return (
    <Reanimated.View
      style={styleAnimation}
      className="transition-transform my-2 rounded-xl w-[70px] flex justify-center items-center bg-rose-500"
    >
      <Ionicons name="trash-bin-outline" size={20} />
    </Reanimated.View>
  );
}

export const LmkCard = ({
  lmk,
}: {
  lmk: TRPCRouterOutputs["lmk"]["list"][number] & { answered: boolean };
}) => (
  <GestureHandlerRootView>
    <ReanimatedSwipeable
      overshootRight={false}
      friction={1.5}
      renderRightActions={RightAction}
    >
      <View className="relative shadow-sm flex flex-col p-4 gap-4 bg-zinc-800 rounded-2xl my-2">
        <View className="flex-[3] flex flex-row items-center justify-between gap-1">
          <View className="flex-[4]">
            <Text className="font-serif text-stone-400">
              {lmk.answered
                ? "You asked us to you let you know when..."
                : "Let me know when..."}
            </Text>
            <Text className="text-white text-xl font-medium">{lmk.query}</Text>
          </View>
          <View className="">
            {lmk.answered ? (
              <Ionicons name="checkmark-circle" size={24} color="#86efac" />
            ) : (
              <Ionicons name="time" size={24} color="#fde68a" />
            )}
          </View>
        </View>
        {/* {
                  <Text className="text-white">
                    {JSON.stringify(lmk.answer, null, 2)}
                  </Text>
                } */}
        {lmk.answered && (
          <View>
            <Text className="text-stone-400 font-serif">
              On January 1st, 2026:{" "}
            </Text>
            <View className="flex flex-row gap-4 my-4">
              {/* <Image
                        source={{
                          uri: "https://www.aljazeera.com/wp-content/uploads/2025/11/ap_690ad7a2c7478-1762318242.jpg?resize=730%2C410&quality=80",
                          width: 100,
                          height: 50,
                        }}
                        className="flex-1 h-full object-cover rounded-md"
                      /> */}
              <View className="flex-[2]">
                <Text className="text-white text-lg font-medium font-serif">
                  {lmk.answer?.fields.title}
                </Text>
                <Text className="text-zinc-400">
                  {lmk.answer?.fields.description}
                </Text>
                <Text className="text-stone-400 mt-2">
                  From the {lmk.answer?.fields.source}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ReanimatedSwipeable>
  </GestureHandlerRootView>
);
