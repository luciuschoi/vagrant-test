# Nested Comments with Rails 5

`Vagrant`를 이용하여 작업할 경우에는 터미널에서 `vagrant up` 명령을 실행하여 작업이 완료되면 `vagrant ssh` 명령으로 가상 머신으로 접속하면 된다.

```sh
$ vagrant up
$ vagrant ssh
```

가상머신에는 우분투가 설치될 것이며 `cd /vagrant` 명령으로 디렉토리를 이동한 후,

```sh
vagrant@vagrant:~$ cd /vagrant
vagrant@vagrant:/vagrant$ bundle install
vagrant@vagrant:/vagrant$ rails db:migrate
```

 이제 `rails server -b 0.0.0.0` 명령을 실행하면 개발모드에서 로컬 웹서버를 실행할 수 있다.

 ```sh
 vagrant@vagrant:/vagrant$ rails server -b 0.0.0.0
 ```

호스트 로컬 머신에서 브라우저를 실행한 후 URL 창에서 http://localhost:9000 으로 연결하면 된다.
