FROM ubuntu

# ubuntu setup
RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install nodejs git -y && apt-get install npm -y

# # install curl for n
RUN apt-get install curl -y
RUN apt-get install vim -y

# obtain latest stable version of node
RUN npm cache clean -f
RUN npm install -g n
RUN n stable

# Install yarn
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn
RUN yarn --version

# Install watchman
RUN git clone https://github.com/facebook/watchman.git
WORKDIR /watchman
RUN git checkout v4.9.0
RUN apt-get install -y autoconf automake build-essential python-dev libssl-dev libtool pkg-config
RUN ./autogen.sh
RUN ./configure
RUN make
RUN make install

# Install Java
RUN apt-get update -y && apt-get install -y software-properties-common

RUN \
  echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | debconf-set-selections && \
  add-apt-repository -y ppa:webupd8team/java && \
  apt-get update && \
  apt-get install -y oracle-java8-installer && \
  rm -rf /var/lib/apt/lists/* && \
  rm -rf /var/cache/oracle-jdk8-installer

ENV JAVA_HOME /usr/lib/jvm/java-8-oracle

# Set up environment variables
ENV ANDROID_HOME="/android-sdk-linux" \
  SDK_URL="https://dl.google.com/android/repository/sdk-tools-linux-3859397.zip" \
  GRADLE_URL="https://services.gradle.org/distributions/gradle-4.5.1-all.zip"

RUN apt-get update -y && apt-get install zip -y

# Download Android SDK
RUN mkdir "$ANDROID_HOME" .android \
  && cd "$ANDROID_HOME" \
  && curl -o sdk.zip $SDK_URL \
  && unzip sdk.zip \
  && rm sdk.zip \
  && yes | $ANDROID_HOME/tools/bin/sdkmanager --licenses

# Install Gradle
RUN wget $GRADLE_URL -O gradle.zip \
  && unzip gradle.zip \
  && mv gradle-4.5.1 gradle \
  && rm gradle.zip \
  && mkdir .gradle

ENV PATH="/home/user/gradle/bin:${ANDROID_HOME}/tools:${ANDROID_HOME}/platform-tools:${PATH}"

# Prepare the app dir
RUN mkdir /App
WORKDIR /App
