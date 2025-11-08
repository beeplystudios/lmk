import { trpc } from "@/lib/trpc";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const headlines = new Array(10).fill(0).map((_, idx) => ({
  id: idx + "",
  headline: "Lorem ipsum dolor sit amet consectetur sit amet",
  imgUrl:
    "https://www.aljazeera.com/wp-content/uploads/2025/11/ap_690ad7a2c7478-1762318242.jpg?resize=730%2C410&quality=80",
  description:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book",
}));

const CreateLmkForm: React.FC = () => {
  const [lmk, setLmk] = useState("");
  const queryClient = useQueryClient();
  const create = useMutation(trpc.lmk.create.mutationOptions());
  const lmkList = useQuery(trpc.lmk.list.queryOptions({}));

  return (
    <View
      // style={{ paddingTop: 64 }}
      onLayout={(e) => {
        // viewY.current = e.nativeEvent.layout.y;
      }}
      className="flex flex-row pb-8"
    >
      <TextInput
        value={lmk}
        onChangeText={setLmk}
        placeholder="Let me know when..."
        className="h-24 shadow-sm px-8 text-2xl grow text-zinc-200 bg-zinc-800 rounded-l-full border-[0.0125rem] border-zinc-300/70 shadow-xs placeholder:text-zinc-300"
      />

      <Pressable
        className={`h-24 border-[0.0125rem] w-max min-w-24 px-2 border-full flex items-center justify-center rounded-r-full active:scale-95 ${
          create.isPending || lmkList.isLoading || lmk.trim() === ""
            ? "bg-zinc-600"
            : "bg-[#CEF5E3]"
        }`}
        onPress={async () => {
          await create.mutateAsync({ query: lmk });
          await queryClient.refetchQueries({
            queryKey: trpc.lmk.list.queryKey(),
          });
          setLmk("");
        }}
        disabled={create.isPending || lmkList.isLoading || lmk.trim() === ""}
      >
        <Text className="font-medium">
          <Ionicons name="add" size={24} />
        </Text>
      </Pressable>
    </View>
  );
};

export default function AnimatedStickyHeader() {
  const [isSticky, setIsSticky] = useState(false);
  const viewY = useRef(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  const [lmk, setLmk] = useState("");
  const user = useSuspenseQuery(trpc.me.queryOptions());
  const lmkList = useSuspenseQuery(trpc.lmk.list.queryOptions({}));

  useEffect(() => console.log(isSticky), [isSticky]);

  const data = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

  // // Interpolate paddingTop: 0 → 16 when sticky
  // const paddingTop = scrollY.interpolate({
  //   inputRange: [0, 1], // 1px scroll triggers full padding
  //   outputRange: [0, 64],
  //   extrapolate: "clamp",
  // });

  const translateY = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: ["0px", "64px"],
    extrapolate: "clamp",
  });

  useEffect(() => {
    console.log(scrollY);
    scrollY.addListener((a) => {
      console.log(a.value, translateY);
    });
  }, [scrollY]);

  console.log(translateY);

  if (!user.data) return <Redirect href="/" />;

  return (
    <View className="p-4 min-h-screen" style={{ backgroundColor: "#18181b" }}>
      <Animated.ScrollView
        stickyHeaderIndices={[1]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true } // must be false for layout props
        )}
      >
        <View>
          <View className="flex items-center justify-between gap-4 flex-row pt-24">
            <Text className="text-stone-400 text-2xl font-medium font-serif">
              Good morning, {user.data?.name.split(" ")[0]}
            </Text>

            <Image
              source={{
                uri: user.data.image!,
              }}
              className="size-12 rounded-full"
            />

            {/* <Button title="Logout" onPress={() => signOut.mutate()} /> */}
          </View>
          <Text className="text-stone-50 mb-2 text-4xl font-semibold font-serif mt-10">
            LetMeKnow!
          </Text>
        </View>
        <View className="pt-12">
          <CreateLmkForm />
        </View>

        <View className="flex flex-col gap-4 pb-24">
          <Text className="text-white font-medium font-serif text-xl -mb-2">
            Your LMKs
          </Text>
          {lmkList.data.map((lmk) => (
            <View
              key={lmk.id}
              className="relative shadow-sm flex flex-row p-4 gap-4 bg-zinc-800 rounded-2xl my-2"
            >
              <View className="flex-[3]">
                <Text className="text-white text-xl font-medium">
                  {lmk.query}
                </Text>
              </View>
            </View>
          ))}
          {lmkList.data.length === 0 && (
            <Text className="text-zinc-400 italic">
              You have no LMKs yet. Create one above!
            </Text>
          )}
        </View>

        {/* <Animated.FlatList
          data={headlines}
          keyExtractor={(item) => item.id}
          renderItem={({ item: headline }) => (

          )}
          ListHeaderComponent={renderHeader}
          // stickyHeaderIndices={[1]}

          // scrollEventThrottle={16}
        /> */}
      </Animated.ScrollView>
    </View>
  );
}

//   const user = useSuspenseQuery(trpc.me.queryOptions());

//   const signOut = useMutation(signOutOptions);

//   if (!user.data) return <Redirect href="/" />;

//   return (
//     <View className="text-white p-4">
//       <ScrollView
//         stickyHeaderIndices={[2]}
//         // style={{ paddingTop: 32 }}
//         showsVerticalScrollIndicator={false}
//       >
// <View className="flex items-center justify-between gap-4 flex-row mt-16">
//   <Text className="text-stone-400 text-2xl font-medium font-serif">
//     Good morning, {user.data?.name.split(" ")[0]}
//   </Text>

//   <Image
//     source={{
//       uri: user.data.image!,
//     }}
//     className="size-12 rounded-full"
//   />
//   {/* <Button title="Logout" onPress={() => signOut.mutate()} /> */}
// </View>

// <Text className="text-stone-50 mb-2 text-4xl font-semibold font-serif mt-8">
//   LetMeKnow!
// </Text>
//         {/* <BlurView
//           className="my-8"
//           intensity={100}
//           tint="systemMaterialDark"
//         ></BlurView> */}

//         <BlurView
//           intensity={120}
//           tint="dark"
//           className="absolute top-0 left-0 right-0 h-16 z-10 justify-center items-center"
//         >
//           {/* <Text className="text-white font-semibold text-lg">
//             I stick to the top 🔥
//           </Text> */}
//           <View className="flex flex-row mb-8 pt-8">
//             <TextInput
//               placeholder="Let me know when..."
//               className="h-24 shadow-sm px-8 text-lg grow text-zinc-200 bg-zinc-800 rounded-l-full border-[0.0125rem] border-zinc-300/70 shadow-xs placeholder:text-zinc-300"
//             />

//             <Pressable className="h-24 bg-[#CEF5E3] border-[0.0125rem] w-max min-w-24 px-2 border-full flex items-center justify-center rounded-r-full">
//               <Text className="font-medium">
//                 <Ionicons name="add-circle" size={24} />
//               </Text>
//             </Pressable>
//           </View>
//         </BlurView>

//         <View className="pb-24 flex flex-col gap-4">
//           <Text className="text-white font-medium font-serif text-xl -mb-2">
//             You might want to hear about...
//           </Text>
//           {headlines.map((headline) => (
// <View
//   key={headline.id}
//   className="relative shadow-sm flex flex-row p-4 gap-4 bg-zinc-800 rounded-2xl"
// >
//   <Image
//     source={{
//       uri: headline.imgUrl,
//       width: 50,
//       height: 30,
//     }}
//     className="flex-[1] h-full object-cover rounded-xl"
//   />

//   <View className="flex-[3]">
//     <Text className="text-white text-xl font-medium">
//       {headline.headline}
//     </Text>
//     <Text className="text-zinc-100 te">
//       {headline.description.slice(0, 80)}...
//     </Text>
//   </View>
// </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }
