# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.network :forwarded_port, guest: 3000, host: 9000, auto_correct: true
  config.vm.network :forwarded_port, guest: 80, host: 8080, auto_correct: true
  config.vm.network :forwarded_port, guest: 6379, host: 6379
  config.vm.network "private_network", ip: "192.168.33.10"
  config.vm.provider "virtualbox" do | vb |
    vb.name = "RORLAB DEV Vagrant for Vagrant-Test Project"
    vb.customize ["modifyvm", :id, "--memory", "1024"]
  end
  config.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"
  config.vm.provision :shell, privileged: false, path: 'setup.sh'
end
