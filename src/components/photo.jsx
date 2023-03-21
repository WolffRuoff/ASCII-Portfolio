import { useEffect, useState } from "react";

const Photo = ({ width, AddSpaces }) => {
  const [finishedPhoto, setPhoto ]= useState("")
  useEffect(() => {
    setPhoto(AddSpaces([
      `                                                                                                    `,
      `                                          .-==+**++=-.                                               `,
      `                                      :+#@@@@@@@@@@@@@%#=.                                          `,
      `                                    -#%%%%%%@%@%%%%%%@%@%%%*:                                       `,
      `                                   -#%%%%%%%@%%%%%%%%@@@@@%@@*                                      `,
      `                                  :%%@@@%%%%%%%%%%@@@@@@@%@@@@=.                                    `,
      `                                  *@@@%*++=++++*##**++++++***%@@%=                                  `,
      `                                 -%%%*+=+==+++==========++++++#@@%%-                                `,
      `                                .#%%*+================-==++++++#%%%%=                               `,
      `                                *%%#======================++++++#%@@%                               `,
      `                               :#%#+=======================+++++*%@@%                               `,
      `                               =%%#+=====================++++++++%@@@.                              `,
      `                               +%%%*==+*#####*++====++**###**+++*%@@@.                              `,
      `                               *%%%*=+*+++++*****==*#%##*+**#%*+*@@@@.                              `,
      `                               .*%%+===+*###%##+==+*#######*++++*@@@%                               `,
      `                                =#%=====+++***++==+*##*****+++++*@@%.                               `,
      `                                =*%======+++======+***++======++*@%#                                `,
      `                                =+*=======++=======+***+=---==++*@##.                               `,
      `                                :==+=====+++=+++===*#*##+====+++*%%*                                `,
      `                                 --*+===+*****##***#%%%##*+==++*#**-                                `,
      `                                  .-+===*##***+++***#######*=++*#*-                                 `,
      `                                    ++==+++#*==--==+++#%#+===+**                                    `,
      `                                    :+++====+*++==-=+*#+++=-+##:                                    `,
      `                                     +*+++======++++++++++++###                                     `,
      `                                      ******+=++********####%%+                                     `,
      `                                      =*##****++++*****#%%%%%**                                     `,
      `                                     .=-+###*******####%%%%#***=.                                   `,
      `                                    .+=-==+*###%#%#%%%%%%#*****##.                                  `,
      `                                    .*=--====+*##%%%%%####******%=:                                 `,
      `                                  ...*+---=======+++***********##--:                                `,
      `                               ...  .-*=----=====+++******+++**#=:---.                              `,
      `                           ......    .=*=----=====+++***+++++**-::------:..                         `,
      `                      .... .....      .=#=----=====++++++++++*-::------:::::::..                    `,
      `                 ..............      .::=*+==-==========+++++--:::----=--:::::......                `,
      `             ..................   .:==-::.:-=+=========---:--===--:------::::::::.:..:..            `,
      `          .................... .:-=--::.......:++====-:::----------:----::::::::.:....:::::.        `,
      `      ..........................::::...... ..   :+*++=:---::::::::::::-:::::::.:.:.....:::::-:.     `,
      `   ............................................   -*=----:::::::..:::::.:::::::::.....::.:::--::.   `,
      ` ....   ........................................ ..:--:::::.......:......:::::.::....::..::::-:-=:  `,
      `.....   ........................................ .::::::................::::::.:....::...::::::-==- `,
      `.....    .......:... ............................::::.:.......:........::::::::.....::...:.:-::-===.`,
      `......   ........... ............................:::..:......::...:....::::::::....:-:....:--:::===-`,
      `.......   ..........  ...........................:..........::....:....:::::.......:-:....---::.=+==`,
      `........ ...........  ......................................::....:.....::::......::-:...:=-:::.=+==`,
      `.........  ......:..  ......................................::....::....::::...:::::-:...=-:::.:+===`,
      `..................... ......................................::....::....::::..::::::=-..-=-:-:.:+===`,
      `.........:........... ............................................::.....:::.::::.:-=-::+-:--:.-+===`,
      `........::........... ........................... .....:...:....:.::...:.::::--:..:-=-::+----..=+=--`,
      `........:::.............................:............  ...................::--::.::-=-::+=--:..++=--`,
    ], true, true));
  }, [width, AddSpaces]);
  return (
    <>
      {finishedPhoto}
    </>
  );
};

export default Photo;
