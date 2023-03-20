import { useEffect, useState } from "react";

const Photo = ({ width, fontSize, AddSpaces }) => {
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
    ], true));
  }, [width, fontSize]);
  return (
    <>
      {finishedPhoto}
    </>
  );
};

export default Photo;
