---
date: "2018-10-10"
tags:
  - 算法
  - asm
  - cpp
---

# 小套路之C++内嵌asm

举个例子, 我们编译它

```cpp
#pragma section(".shell",read,execute)
__declspec(allocate(".shell"))
unsigned char code[] =
"\xB8\x04\x00\x00\x00";

// Function pointer points to the address of function.
int(*shell)(); //Function pointer
// Initializing a function pointer  with the address of a shellcode
shell = ((int(*)())&code);
// Execute shellcode
int a = shell();
```
