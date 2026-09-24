' Chay mot lenh o che do an hoan toan (khong hien cua so CMD)
' Cach dung: wscript //nologo _hidden.vbs "<thu muc lam viec>" "<lenh>"
Option Explicit
Dim sh, args
Set args = WScript.Arguments
If args.Count < 2 Then WScript.Quit 1
Set sh = CreateObject("WScript.Shell")
sh.CurrentDirectory = args(0)
sh.Run "cmd /c " & args(1), 0, False
