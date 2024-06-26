const codeLines = [
    "#define WIN32_LEAN_AND_MEAN",
    "#define CREATE_THREAD_ACCESS (PROCESS_CREATE_THREAD | PROCESS_QUERY_INFORMATION)",
    "",
    "BOOL Inject(DWORD pID, const char * DLL_NAME);",
    "DWORD GetTargetThreadIDFromProcName(const char * ProcName);",
    "",
    "int main(int ar",
    "   DWORD pID = GetTargetThreadIDFromProcName(\"Engi",
    "   char buf[MAX_PATH] = {0};",
    "   GetFullPathName(\"HACKS.dll\", MAX_PATH, buf, NULL);",
    "   printf(bu",
    "   if(!Inject(pID, buf))",
    "   {",
    "        printf(\"DLL Not Loaded!\");",
    "    }else{",
    "        printf(\"DLL Loaded!\");",
    "    }",
    "",
    "    _getch();",
    "   return 0;",
    "}",
    "",
    "BOOL Inject(DWORD pID, const char * DLL_NAME)",
    "{",
    "   HANDLE Proc;",
    "   HMODULE hLib;",
    "   char buf[50] = {0};",
    "   LPVOID RemoteString, LoadLibAddy;",
    "",
    "   if(!pID)",
    "      return false;",
    "",
    "   Proc = OpenProcess(PROCESS_ALL_ACCESS, FALSE, pID);",
    "   if(!Proc)",
    "   {",
    "      sprintf(buf, \"OpenProcess() failed: %d\", GetLastError());",
    "      printf(buf);",
    "      return false;",
    "   }",
    "   ",
    "   LoadLibAddy = (LPVOID)GetProcAddress(GetModuleHandle(\"kernel32.dll\"), \"LoadLibraryA\");",
    "   ",
    "   ",
    "   RemoteString = (LPVOID)VirtualAllocEx(Proc, NULL, strlen(DLL_NAME), MEM_RESERVE | MEM_COMMIT, PAGE_READWRITE);",
    "",
    "   ",
    "   WriteProcessMemory(Proc, (LPVOID)RemoteString, DLL_NAME, strlen(DLL_NAME), NULL);",
    "   CreateRemoteThread(Proc, NULL, NULL, (LPTHREAD_START_ROUTINE)LoadLibAddy, (LPVOID)RemoteString, NULL, NULL);",
    "",
    "   CloseHandle(Proc);",
    "   return true;",
    "}",
    "",
    "DWORD GetTargetThreadIDFromProcName(const char * ProcName)",
    "{",
    "   PROCESSENTRY32 pe;",
    "   HANDLE thSnapShot;",
    "   BOOL retval, ProcFound = false;",
    "",
    "   thSnapShot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);",
    "   if(thSnapShot == INVALID_HANDLE_VALUE)",
    "   {",
    "      printf(\"Error: Unable to create toolhelp snapshot!\");",
    "      return false;",
    "   }",
    "",
    "   pe.dwSize = sizeof(PROCESSENTRY32);",
    "   ",
    "   retval = Process32First(thSnapShot, &pe);",
    "   while(retval)",
    "   {",
    "      if(StrStrI(pe.szExeFile, ProcName))",
    "      {",
    "         return pe.th32ProcessID;",
    "      }",
    "      retval = Process32Next(thSnapShot, &pe);",
    "   }",
    "   return 0;",
    "}"
];

const container = document.getElementById('container');
let typingStarted = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeCode() {
    if (!container) return; // Check if container is null
    
    for (let line of codeLines) {
        await sleep(Math.random() * 100 + 100); // Simulate typing speed
        container.innerHTML += line + '<br>';
        container.scrollTop = container.scrollHeight; // Auto-scroll to bottom
    }
}

document.addEventListener('keydown', function(event) {
    if (!typingStarted) {
        typingStarted = true;
        typeCode();
    }
});
