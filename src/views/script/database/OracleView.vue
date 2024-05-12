<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <form>
          <div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="loginYN" name="loginYN" role="switch">
              <label class="form-check-label" for="loginYN">로그인 명령어를 생성하겠습니까?</label>
            </div>
          </div>
          
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="showDatabase">
            <label class="form-check-label" for="showDatabase">현재 생성된 데이터베이스 목록을 확인하겠습니까?</label>
          </div>
          
          <div>
            <div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="createDataBaseYN" name="createDataBaseYN" role="switch">
              <label class="form-check-label" for="createDataBaseYN">테이블스페이스를 생성 하시겠습니까?</label>
              <div class="hideDiv">
                <label>테이블스페이스명</label>
                <div class="form-floating">
                  <input class="form-control" type="text" id="dataBaseName" name="dataBaseName">
                  <label class="form-check-label" for="dataBaseName">테이블스페이스명을 입력해주세요.</label>
                </div>
                <label>테이블스페이스 경로</label>
                <div class="form-floating">
                  <input class="form-control" type="text" id="dataBasePath" name="dataBasePath">
                  <label class="form-check-label" for="dataBasePath">테이블스페이스 경로를 입력해주세요.</label>
                </div>
                <label>테이블스페이스 사이즈(M)</label>
                <div class="form-floating">
                  <input class="form-control" type="text" id="dataBaseSize" name="dataBaseSize">
                  <label class="form-check-label" for="dataBaseSize">테이블스페이스 사이즈(M)를 입력해주세요.</label>
                </div>
                <label>테이블스페이스 사이즈(M)</label>
                <div class="form-floating">
                  <input class="form-control" type="text" id="dataBaseAutoSize" name="dataBaseAutoSize">
                  <label class="form-check-label" for="dataBaseAutoSize">테이블스페이스 자동확장용량(M)를 입력해주세요.</label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" name="createUser" id="createUser">
            <label class="form-check-label" for="createUser">계정을 생성할까요?</label>
            <div class="hideDiv">
              <label>생성계정 ID</label>
              <div class="form-floating">
                <input class="form-control" type="text" id="createUserID" name="createUserID">
                <label class="form-check-label" for="createUserID">생성할 계정의 ID를 입력해주세요.</label>
              </div>
              <label>생성계정 PW</label>
              <div class="form-floating">
                <input class="form-control" type="text" id="createUserPW" name="createUserPW">
                <label class="form-check-label" for="createUserPW">생성할 계정 PW를 입력해주세요.</label>
              </div>
              <label>테이블스페이스 명</label>
              <div class="form-floating">
                <input class="form-control" type="text" id="createUserTablespaceName" name="createUserTablespaceName">
                <label class="form-check-label" for="createUserTablespaceName">생성할 계정의 테이블스페이스 명을 입력해주세요.</label>
              </div>
            </div>
          </div>
          
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" name="showDirectory" id="showDirectory">
            <label class="form-check-label" for="showDirectory">디렉토리 목록을 확인할까요?</label>
          </div>
          
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" name="createDirectoryYN" id="createDirectoryYN">
            <label class="form-check-label" for="createDirectoryYN">디렉토리를 생성할까요?</label>
            <div class="hideDiv">
              <label>디렉토리 명</label>
              <div class="form-floating">
                <input class="form-control" type="text" id="directoryName" name="directoryName" aria-label="First name">
                <label class="form-check-label" for="directoryName"> 생성할 디렉토리의 이름을 입력해주세요.</label>
              </div>
              <label>디렉토리 경로</label>
              <div class="form-floating">
                <input class="form-control" type="text" id="directoryPath" name="directoryPath" aria-label="Last name">
                <label class="form-check-label" for="directoryPath">생성할 디렉토리의 경로를 입력해주세요.</label>
              </div>
            </div>
          </div>
          
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" name="grantDirectoryYN" id="grantDirectoryYN">
            <label class="form-check-label" for="grantDirectoryYN">디렉토리 권한을 부여할까요?</label>
            <div class="hideDiv">
              <label>디렉토리 권한 유저</label>
              <div class="form-floating">
                <input class="form-control" type="text" id="grantDirectoryUser" name="grantDirectoryUser">
                <label class="form-check-label" for="grantDirectoryUser">디렉토리 권한을 가질 유저를 입력해주세요.</label>
              </div>
              <label>디렉토리 명</label>
              <div class="form-floating">
                <input class="form-control" type="text" id="grantDirectoryName" name="grantDirectoryName">
                <label class="form-check-label" for="grantDirectoryName">권한을 부여할 디렉토리 명을 입력해주세요.</label>
              </div>
            </div>
          </div>
          
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="grantAll" name="grantAll">
            <label class="form-check-label" for="grantAll">유저 권한을 부여할 것인가요?</label>
            <div class="hideDiv">
              <label>유저 권한 설정</label>
              <div class="form-floating">
                <input class="form-control" type="text" name="grantID" id="grantID">
                <label class="form-label" for="grantID">권한을 가질 유저를 입력해주세요.</label>
              </div>
            </div>
          </div>
          
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="dumpDB" name="dumpDB">
            <label class="form-check-label" for="dumpDB">테이블스페이스를 백업하시겠습니까?</label>
            <div class="hideDiv">
              <label>백업 계정 설정</label>
              <div class="form-floating">
                <input class="form-control" type="text" name="dumpDBUser" id="dumpDBUser">
                <label class="form-label" for="dumpDBUser">백업을 실행할 계정을 입력해주세요.</label>
              </div>
              <label>백업 계정 비밀번호</label>
              <div class="form-floating">
                <input class="form-control" type="text" name="dumpDBPW" id="dumpDBPW">
                <label class="form-label" for="dumpDBPW">백업을 실행할 비밀번호를 입력해주세요.</label>
              </div>
            </div>
            <div class="form-check form-switch hideDiv">
              <input class="form-check-input" type="checkbox" role="switch" id="dumpDBExpdp" name="dumpDBExpdp">
              <label class="form-check-label" for="dumpDBExpdp">EXPDP를 사용하시겠습니까?</label>
              <div class="hideDiv">
                <label>백업 SID</label>
                <div class="form-floating">
                  <input class="form-control" type="text" name="dumpDBSID" id="dumpDBSID">
                  <label class="form-label" for="dumpDBSID">테이블스페이스를 백업할 SID를 입력해주세요.</label>
                </div>
                <label>백업 파일명</label>
                <div class="form-floating">
                  <input class="form-control" type="text" name="dumpDBFileName" id="dumpDBFileName">
                  <label class="form-label" for="dumpDBFileName">테이블스페이스를 백업할 파일명을 입력해주세요.</label>
                </div>
                <label>백업 디렉토리명</label>
                <div class="form-floating">
                  <input class="form-control" type="text" name="dumpDBDirectory" id="dumpDBDirectory">
                  <label class="form-label" for="dumpDBDirectory">테이블스페이스를 백업할 디렉토리명을 입력해주세요.</label>
                </div>
                <label>백업 스키마</label>
                <div class="form-floating">
                  <input class="form-control" type="text" name="dumpDBSchema" id="dumpDBSchema">
                  <label class="form-label" for="dumpDBSchema">테이블스페이스를 백업할 스키마를 입력해주세요.</label>
                </div>
                <label>버전 적용</label>
                <div class="form-floating">
                  <input class="form-control" type="text" name="dumpDBVersion" id="dumpDBVersion">
                  <label class="form-label" for="dumpDBVersion">버전을 적용할 경우 사용해주세요.</label>
                </div>
                <label>로그파일 작성</label>
                <div class="form-floating">
                  <input class="form-control" type="text" name="dumpDBLogName" id="dumpDBLogName">
                  <label class="form-label" for="dumpDBLogName">EXPORT에 대한 로그파일 명을 작성해주세요.</label>
                </div>
              </div>
            </div>
            <div class="form-check form-switch hideDiv">
              <input class="form-check-input" type="checkbox" role="switch" id="dumpDBExp" name="dumpDBExp">
              <label class="form-check-label" for="dumpDBExp">EXP를 사용하시겠습니까?</label>
              <div class="hideDiv">
                <label>백업 경로</label>
                <div class="form-floating">
                  <input class="form-control" type="text" name="dumpDBPath" id="dumpDBPath">
                  <label class="form-label" for="dumpDBPath">테이블스페이스를 백업할 경로 및 파일명을 입력해주세요.</label>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="restoreDB" name="restoreDB">
            <label class="form-check-label" for="restoreDB">테이블스페이스를 복원하시겠습니까?</label>
            <div class="hideDiv">
              <label>복원 계정 설정</label>
              <div class="form-floating">
                <input class="form-control" type="text" name="restoreDBUser" id="restoreDBUser">
                <label class="form-label" for="restoreDBUser">복원을 실행할 계정을 입력해주세요.</label>
              </div>
              <label>복원 계정 비밀번호</label>
              <div class="form-floating">
                <input class="form-control" type="text" name="restoreDBPW" id="restoreDBPW">
                <label class="form-label" for="restoreDBPW">복원을 실행할 비밀번호를 입력해주세요.</label>
              </div>
              <label>복원 테이블 스페이스</label>
              <div class="form-floating">
                <input class="form-control" type="text" name="restoreDBTablespace" id="restoreDBTablespace">
                <label class="form-label" for="restoreDBTablespace">복원을 할 테이블스페이스명을 입력해주세요.</label>
              </div>
              <label>복원 파일 경로</label>
              <div class="form-floating">
                <input class="form-control" type="text" name="restoreDBPath" id="restoreDBPath">
                <label class="form-label" for="restoreDBPath">데이터베이스를 복원할 경로 및 파일명을 입력해주세요.</label>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="dumpDBImpdp" name="dumpDBImpdp">
                <label class="form-check-label" for="dumpDBImpdp">IMPDP를 사용하시겠습니까?</label>
                <div class="hideDiv">
                  <label>복원 SID</label>
                  <div class="form-floating">
                    <div class="form-floating">
                      <input class="form-control" type="text" name="restoreDBSID" id="restoreDBSID">
                      <label class="form-label" for="restoreDBSID">테이블스페이스를 백업할 SID를 입력해주세요.</label>
                    </div>
                  </div>
                  <label>로그 파일 경로</label>
                  <div class="form-floating">
                    <input class="form-control" type="text" name="restoreLogFile" id="restoreLogFile">
                    <label class="form-label" for="restoreLogFile">로그 파일 경로를 지정해주세요.</label>
                  </div>
                  <label>백업 파일의 스키마</label>
                  <div class="form-floating">
                    <input class="form-control" type="text" name="backupDBSchema" id="backupDBSchema">
                    <label class="form-label" for="backupDBSchema">백업 파일의 스키마를 지정해주세요.</label>
                  </div>
                  <label>복원 테이블스페이스 스키마</label>
                  <div class="form-floating">
                    <input class="form-control" type="text" name="restoreDBSchema" id="restoreDBSchema">
                    <label class="form-label" for="restoreDBSchema">복원 할 테이블스페이스의 스키마</label>
                  </div>
                  <label>백업 파일의 테이블 스페이스</label>
                  <div class="form-floating">
                    <input class="form-control" type="text" name="backupDBTablespace" id="backupDBTablespace">
                    <label class="form-label" for="backupDBTablespace">백업 파일의 테이블 스페이스를 지정해주세요.</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="col-6">
        <button id="btn_result" v-on:click="result">결과</button>
        <div class="form-floating">
          <textarea class="form-control" id="resultText" rows="3" style="height:700px;">
          {{ resultTxt }}
          </textarea>
          <label for="resultText" class="form-label">결과</label>
        </div>
      </div>
                  
    </div>
	</div>
</template>

<style scoped>
	.form-switch .form-check-input:checked~.hideDiv{
		display:block;
	}
	
	.hideDiv{
		display:none;
	}
</style>

<script lang="ts">
export default {
  data:() => {
    return {
      resultTxt: ''
    }
  },
  methods:{
    result(){
			var result = "";
			
			if(this.isChecked('loginYN')){
				result += "\nsqlplus;";
			}
			
			if(this.isChecked('showDatabase')){
				result += "\nshow databases;";
			}
			
			if(this.isChecked('createDataBaseYN')){
				result += "\nCREATE TABLESPACE "+ this.value('dataBaseName') +" DATAFILE \'"+this.value('dataBasePath')+"\' SIZE "+this.value('dataBaseSize')+"M REUSE AUTOEXTEND ON NEXT "+this.value('dataBaseAutoSize')+"M MAXSIZE UNLIMITED;";
			}
			
			if(this.isChecked('createUser')){
				result += "\nCREATE USER "+this.value('createUserID') +" IDENTIFIED BY "+this.value('createUserPW');
        let createUserTablespaceName = this.value('createUserTablespaceName');
				if(createUserTablespaceName != ''){
					result += " DEFAULT TABLESPACE "+createUserTablespaceName;
				}
				result += ";";
			}
			
			if(this.isChecked('showDirectory')){
				result += "\nSELECT * FROM DBA_DIRECTORIES;";
			}
			
			if(this.isChecked('createDirectoryYN')){
				result += "\nCREATE DIRECTORY "+this.value('directoryName')+" AS \'"+this.value('directoryPath')+"\';";
			}
			
			if(this.isChecked('grantDirectoryYN')){
				result += "\nGRANT READ, WRITE ON DIRECTORY "+this.value('grantDirectoryName')+" TO "+this.value('grantDirectoryUser')+";";
			}
			
			if(this.isChecked('grantAll')){
				result += "\nGRANT CONNECT, RESOURCE, SYSDBA, DBA TO "+this.value('grantID')+";";
			}
			
			if(this.isChecked('dumpDB')){
        let dumpDBUser = this.value('dumpDBUser');
        let dumpDBPW = this.value('dumpDBPW');
				if(this.isChecked('dumpDBExpdp')){
					result += "\nexpdp "+dumpDBUser+"/"+dumpDBPW+"@"+this.value('dumpDBSID')
                  + " dumpfile = "+this.value('dumpDBFileName')
                  + " directory="+this.value('dumpDBDirectory');
          
          let dumpDBLogName = this.value('dumpDBLogName');
					if(dumpDBLogName != ''){
						result += " logfile = "+ dumpDBLogName;
					}
          let dumpDBVersion = this.value('dumpDBVersion');
					if(dumpDBVersion != ''){
						result += " version = "+ dumpDBVersion;
					}
          let dumpDBSchema = this.value('dumpDBSchema');
					if(dumpDBSchema != ''){
						result += " schemas = "+dumpDBSchema;
					}
          result += ";";
				}
				
				if(this.isChecked('dumpDBExp')){
					result += "\nexp "+ dumpDBUser + "/"+ dumpDBPW +" file="+this.value('dumpDBPath');
				}
			}
			
			if(this.isChecked('restoreDB')){
        let restoreDBUser = this.value('restoreDBUser');
        let restoreDBPW = this.value('restoreDBPW');
        let restoreDBSID = this.value('restoreDBSID');
        let restoreDBPath = this.value('restoreDBPath');
        let restoreLogFile = this.value('restoreLogFile');
        let backupDBSchema = this.value('backupDBSchema');
        let restoreDBSchema = this.value('restoreDBSchema');
        let backupDBTablespace = this.value('backupDBTablespace');
        let restoreDBTablespace = this.value('restoreDBTablespace');
        if(this.isChecked('dumpDBImpdp')){
          result += "\nimpdp "+restoreDBUser+"/"+restoreDBPW+"@"+restoreDBSID
                      +" dumpfile="+restoreDBPath
                      +(restoreLogFile != ''? " logfile="+restoreLogFile: "")
                      +(backupDBSchema != '' && restoreDBSchema != ''? " remap_schema="+backupDBSchema+":"+restoreDBSchema:"")
                      +(backupDBTablespace != '' && restoreDBTablespace != ''? " remap_tablespace="+backupDBTablespace+":"+restoreDBTablespace:"")
                      +";";
        }
			}
			
      this.resultTxt = result;
    },
    isChecked(id: string){
      let checkbox = document.getElementById(id) as HTMLInputElement
      return checkbox.checked;
    },
    value(id: string){
      console.log(id)
      let el = document.getElementById(id) as HTMLInputElement
      return el.value;
    }
  }
}

</script>